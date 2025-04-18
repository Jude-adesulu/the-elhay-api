import {
    Injectable,
    Logger,
    InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { randomBytes } from "crypto";
import { Token } from "./model/token.model";
import { TokenType } from "src/common/enums/token-type.enum";
import { User } from "src/user/model/user.model";

@Injectable()
export class TokenService {
    private readonly logger = new Logger(TokenService.name);
    private static instance: TokenService;

    private constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private configService: ConfigService,
    ) {
        this.logger.log("TokenService instance created");
    }

    static getInstance(
        tokenRepository: Repository<Token>,
        configService: ConfigService,
    ): TokenService {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService(
                tokenRepository,
                configService,
            );
        }
        return TokenService.instance;
    }

    async findValidToken(
        token: string,
        type: TokenType,
    ): Promise<Token | null> {
        return this.tokenRepository.findOne({
            where: {
                token,
                type,
                expires_at: MoreThan(new Date()), // Token not expired
            },
            relations: ["user"],
        });
    }

    async generateForUser(user: User, type: TokenType): Promise<Token> {
        const expirationTimeInSec = parseInt(
            this.configService.get<string>("TOKEN_VALIDITY_DURATION_IN_SEC") ||
                "3600000",
        );

        try {
            // Generate new token
            const existingToken = await this.tokenRepository.findOne({
                where: {
                    user_id: user.id,
                    type,
                },
            });

            if (existingToken) {
                return existingToken;
            }

            const token = this.tokenRepository.create({
                user_id: user.id,
                token: randomBytes(32).toString("hex"),
                type,
                expires_at: new Date(Date.now() + expirationTimeInSec),
                user: user,
            });

            return await this.tokenRepository.save(token);
        } catch (error) {
            throw new InternalServerErrorException(
                `Failed to generate token for user ${user.email}: ${error.message}`,
                error.stack,
            );
        }
    }

    async deleteToken(id: string): Promise<void> {
        await this.tokenRepository.softDelete(id);
    }
}
