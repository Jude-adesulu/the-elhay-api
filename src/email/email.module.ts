import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { TokenModule } from "src/token/token.module";
import { CommonModule } from "src/common/common.module";
import { ConfigService } from "@nestjs/config";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";

@Module({
    imports: [TokenModule, UserModule, CommonModule],
    providers: [
        UserService,
        {
            provide: EmailService,
            useFactory: (configService: ConfigService) => {
                return EmailService.getInstance(configService);
            },
            inject: [ConfigService],
        },
    ],
    exports: [EmailService],
})
export class EmailModule {}
