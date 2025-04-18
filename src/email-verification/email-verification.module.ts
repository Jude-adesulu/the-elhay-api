import { Module } from "@nestjs/common";
import { EmailVerificationService } from "./email-verification.service";
import { EmailVerificationController } from "./email-verification.controller";
import { TokenModule } from "src/token/token.module";
import { EmailModule } from "src/email/email.module";
import { CommonModule } from "src/common/common.module";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [UserModule, TokenModule, EmailModule, CommonModule],
    providers: [EmailVerificationService, UserService],
    controllers: [EmailVerificationController],
    exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
