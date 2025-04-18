import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { TokenType } from "src/common/enums/token-type.enum";
import { EmailService } from "src/email/email.service";
import { Token } from "src/token/model/token.model";
import { TokenService } from "src/token/token.service";
import { User } from "src/user/model/user.model";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

@Injectable()
export class EmailVerificationService {
    private readonly logger = new Logger(EmailVerificationService.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly emailService: EmailService,
    ) {}

    async initiateTokenProcess(email: string, type: TokenType): Promise<Token> {
        this.logger.log("Got to initiateTokenProcess");

        const user = await this.userService.findUserByEmail(
            email,
            false,
        );
        if (!user)
            throw new NotFoundException(ResponseMessagesEnum.ACCOUNT_NOT_FOUND);

        const token = await this.tokenService.generateForUser(user, type);

        this.logger.log("Token persisted, about to send Email");

        // Send email asynchronously (non-blocking)
        this.emailService.sendTokenEmail(user, token, type).catch((error) => {
            this.logger.error(
                `Failed to send email for user ${email}: ${error.message}`,
                error.stack,
            );
        });

        return token;
    }

    async validateAndConsumeToken(
        tokenString: string,
        type: TokenType,
    ): Promise<User> {
        const token = await this.tokenService.findValidToken(tokenString, type);
        if (!token)
            throw new BadRequestException(ResponseMessagesEnum.INVALID_TOKEN);
    
        const user = token.user;
    
        if (!user.is_email_verified) {
            user.is_email_verified = true;
            await this.userRepository.save(user);
            await this.tokenService.deleteToken(token.id);
        }
    
        return user;
    }
}
