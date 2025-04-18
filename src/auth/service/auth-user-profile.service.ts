import {
    BadRequestException,
    Injectable,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "../dto/login-user.dto";
import { ConfigService } from "@nestjs/config";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { PasswordService } from "src/common/services/password.service";
import { TokenType } from "src/common/enums/token-type.enum";
import { EmailVerificationService } from "src/email-verification/email-verification.service";
import { UserService } from "src/user/user.service";
import { UserProfileService } from "src/user-profile/services/user-profile.service";
import { CreateUserProfileDto } from "src/user-profile/dto/create-user-profile.dto";
import { User } from "src/user/model/user.model";
import { DataSource } from 'typeorm';

@Injectable()
export class AuthUserProfileService {
    private readonly logger = new Logger(AuthUserProfileService.name);
    constructor(
        private readonly userService: UserService,
        private readonly userProfileService: UserProfileService,
        private readonly jwtService: JwtService,
        private readonly passwordService: PasswordService,
        private readonly emailVerificationService: EmailVerificationService,
        private readonly dataSource: DataSource,
    ) {}

    async signup(createUserProfileDto: CreateUserProfileDto) {
        const isSignUp = true;

        const existingUser = await this.userService.findUserByEmail(
            createUserProfileDto.email,
            isSignUp,
        );

        if (existingUser) {
            throw new BadRequestException(
                ResponseMessagesEnum.EMAIL_ALREADY_EXISTS,
            );
        }

        const hashedPassword = await this.passwordService.hashPassword(
            createUserProfileDto.password,
        );

        // Start a transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.userService.createUser(
                createUserProfileDto.email,
                hashedPassword,
                { transaction: queryRunner.manager },
            );

            await this.userProfileService.createUserProfile(user, createUserProfileDto, {
                transaction: queryRunner.manager,
            });

            // Commit the transaction if everything succeeds
            await queryRunner.commitTransaction();

            // Send verification email asynchronously
            this.emailVerificationService
                .initiateTokenProcess(user.email, TokenType.EMAIL_VERIFICATION)
                .catch((error) => {
                    this.logger.error(
                        `Failed to send email for user ${user.email}`,
                        error.stack,
                    );
                });

            return this.generateToken(user);
        } catch (error) {
            // Rollback the transaction if any step fails
            await queryRunner.rollbackTransaction();

            this.logger.error(
                ResponseMessagesEnum.SIGNUP_FAILED +
                    " : " +
                    error.message,
            );

            throw new Error(
                ResponseMessagesEnum.SIGNUP_FAILED,
            );
        } finally {
            // Release the query runner
            await queryRunner.release();
        }
    }

    async login(loginDto: LoginUserDto) {
        // this would throw an exception if user not found
        const user: User = await this.userService.validateUser(
            loginDto.email,
            loginDto.password,
        );

        try {
            await this.userProfileService.findUserProfileByUserId(
                user.id,
            );
            return this.generateToken(user);
        } catch (error) {
            this.logger.warn(ResponseMessagesEnum.INVALID_DETAILS, error);
            throw new BadRequestException(
                ResponseMessagesEnum.INVALID_DETAILS,
            );
        }
    }

    async generateToken(user: User) {
        const payload = {
            email: user.email,
            sub: user.id,
        };

        return this.jwtService.sign(payload);
    }
}
