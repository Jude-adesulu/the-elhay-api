import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull, Not, EntityManager } from "typeorm";
import { User } from "./model/user.model";
import { PasswordService } from "src/common/services/password.service";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly passwordService: PasswordService,
    ) {}

    async createUser(
        email: string,
        password: string,
        options?: { transaction?: EntityManager },
    ): Promise<User> {
        const user = this.userRepository.create({
            email,
            password,
        });

        if (options?.transaction) {
            return options.transaction.save(user);
        }

        return this.userRepository.save(user);
    }

    async findUserByEmail(email: string, isSignUp: boolean): Promise<User> {
        let user: User;

        if (isSignUp) {
            // For signup, check both active and soft-deleted records
            user = await this.userRepository.findOne({
                where: [
                    { email, deleted_at: IsNull() },
                    { email, deleted_at: Not(IsNull()) },
                ],
                withDeleted: true, // Include soft-deleted records
            });
        } else {
            // For normal queries, only active records
            user = await this.userRepository.findOne({
                where: { email },
            });
        }

        return user;
    }

    async findUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["admin", "userProfile"],
        });

        if (!user) {
            throw new NotFoundException(ResponseMessagesEnum.ACCOUNT_NOT_FOUND);
        }

        return user;
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({
            relations: ["userProfile", "admin"],
        });
    }

    async remove(userId: string): Promise<string> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new NotFoundException(ResponseMessagesEnum.ACCOUNT_NOT_FOUND);
        }

        if (user.id !== userId) {
            throw new ForbiddenException(
                "DELETE: " + ResponseMessagesEnum.USER_PERMISSION_DENIED,
            );
        }

        await this.userRepository.softDelete(userId);

        return ResponseMessagesEnum.ACCOUNT_CLOSED;
    }

    async validateUser(email: string, password: string): Promise<any> {
        const isSignUp = false;

        const user = await this.findUserByEmail(email, isSignUp);

        if (!user) {
            throw new BadRequestException(
                ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
            );
        }
        if (!user.password) {
            throw new BadRequestException(
                ResponseMessagesEnum.LOGIN_WITH_GOOGLE,
            );
        }

        const isMatch: boolean = await this.passwordService.comparePasswords(
            password,
            user.password,
        );

        if (!isMatch) {
            throw new BadRequestException(ResponseMessagesEnum.INVALID_DETAILS);
        }

        if (user && isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
