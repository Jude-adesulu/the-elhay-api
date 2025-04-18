import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PasswordService {
    constructor(private readonly configService: ConfigService) {}

    async hashPassword(password: string): Promise<string> {
        const saltRounds = parseInt(
            this.configService.get<string>("BCRYPT_SALT_ROUNDS"),
            10,
        ); // Default to 10 if not specified
        return bcrypt.hash(password, saltRounds);
    }

    async comparePasswords(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, hashedPassword);
    }
}
