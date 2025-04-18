import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { TokenModule } from "./token/token.module";
import { CommonModule } from "./common/common.module";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { AdminModule } from "./admin/admin.module";
import { UserProfileModule } from "./user-profile/user-profile.module";
import { EmailModule } from "./email/email.module";
import { EmailVerificationModule } from "./email-verification/email-verification.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const host = configService.get<string>("DATABASE_HOST");
                const port = parseInt(
                    configService.get<string>("DATABASE_PORT"),
                    10,
                );
                const username = configService.get<string>("DATABASE_USER");
                const password = configService.get<string>("DATABASE_PASS");
                const database = configService.get<string>("DATABASE_NAME");
                return {
                    type: "mysql",
                    host,
                    port,
                    username,
                    password,
                    database,
                    entities: [__dirname + "/**/*.model{.ts,.js}"],
                    synchronize: false,
                    logging: ["error", "warn"],
                    namingStrategy: new SnakeNamingStrategy(),
                };
            },
            inject: [ConfigService],
        }),
        AuthModule,
        UserModule,
        AdminModule,
        UserProfileModule,
        TokenModule,
        CommonModule,
        EmailModule,
        EmailVerificationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
