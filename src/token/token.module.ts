import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { Token } from "./model/token.model";
import { UserModule } from "src/user/user.module";
import { CommonModule } from "src/common/common.module";
import { ConfigService } from "@nestjs/config";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Token]), UserModule, CommonModule],
    providers: [
        {
            provide: TokenService,
            useFactory: (
                tokenRepository: Repository<Token>,
                configService: ConfigService,
            ) => {
                return TokenService.getInstance(tokenRepository, configService);
            },
            inject: [getRepositoryToken(Token), ConfigService], // Ensure you inject the TypeORM model token
        },
    ],
    exports: [TokenService, TypeOrmModule],
})
export class TokenModule {}
