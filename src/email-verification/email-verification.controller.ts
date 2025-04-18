import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { TokenType } from "src/common/enums/token-type.enum";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseCodesEnum } from "src/common/enums/response-codes.enum";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import {
    createResponse,
    CustomApiResponse,
} from "src/common/utils/general-utils";
import { EmailVerificationService } from "./email-verification.service";

@ApiTags(TokenType.EMAIL_VERIFICATION)
@Controller("/verify-email")
export class EmailVerificationController {
    constructor(
        private readonly emailVerificationService: EmailVerificationService,
    ) {}

    @Get(":token")
    @ApiOperation({ summary: "Verify Email" })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.TOKEN_VERIFIED,
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.INVALID_TOKEN,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async verifyToken(
        @Param("token") token: string,
    ): Promise<CustomApiResponse> {
        await this.emailVerificationService.validateAndConsumeToken(
            token,
            TokenType.EMAIL_VERIFICATION,
        );

        return createResponse(
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.TOKEN_VERIFIED,
        );
    }
}
