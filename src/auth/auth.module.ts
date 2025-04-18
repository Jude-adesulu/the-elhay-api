import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfileModule } from "@/user-profile/user-profile.module";
import { UserModule } from "@/user/user.module";
import { AuthUserProfileController } from "./controller/auth-user-profile.controller";
import { User } from "@/user/model/user.model";
import { UserProfile } from "@/user-profile/models/user-profile.model";
import { LocalStrategy } from "./strategy/local.strategy";
import { LocalAuthGuard } from "./security/local-auth.guard";
import { JwtAuthGuard } from "./security/jwt-auth.guard";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { GoogleStrategy } from "./strategy/google-oauth.strategy";
import { AuthUserProfileService } from "./service/auth-user-profile.service";
import { Admin } from "@/admin/models/admin.model";
import { AdminModule } from "@/admin/admin.module";
import { CommonModule } from "@/common/common.module";
import { TokenModule } from "@/token/token.module";
import { EmailModule } from "@/email/email.module";
import { EmailVerificationModule } from "@/email-verification/email-verification.module";

@Module({
    imports: [
        CommonModule,
        UserModule,
        UserProfileModule,
        AdminModule,
        PassportModule,
        TokenModule,
        EmailModule,
        EmailVerificationModule,
        JwtModule.registerAsync({
            imports: [CommonModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: {
                    expiresIn: parseInt(
                        configService.get<string>(
                            "TOKEN_VALIDITY_DURATION_IN_SEC",
                        ) || "3600000", // fallback
                        10,
                    ),
                },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User, UserProfile, Admin]),
    ],
    controllers: [AuthUserProfileController],
    providers: [
        LocalStrategy,
        LocalAuthGuard,
        JwtAuthGuard,
        JwtStrategy,
        GoogleStrategy,
        AuthUserProfileService,
    ],
    exports: [JwtModule, TypeOrmModule],
})
export class AuthModule {}
