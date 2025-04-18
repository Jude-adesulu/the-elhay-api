import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Res,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUserDto } from "../dto/login-user.dto";
import { Response } from "express";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { ResponseCodesEnum } from "src/common/enums/response-codes.enum";
import { AuthUserProfileService } from "../service/auth-user-profile.service";
import { createResponse } from "src/common/utils/general-utils";
import { CreateUserProfileDto } from "src/user-profile/dto/create-user-profile.dto";
import { ConfigService } from "@nestjs/config";

@ApiTags("authenication for user")
@Controller("auth/user")
export class AuthUserProfileController {
    constructor(
        private readonly authService: AuthUserProfileService,
        private readonly configService: ConfigService,
    ) {}

    @Post("signup")
    @ApiOperation({ summary: "Signup User" })
    @ApiBody({ type: CreateUserProfileDto })
    @ApiResponse({
        status: ResponseCodesEnum.CREATED,
        description: ResponseMessagesEnum.SIGNUP_SUCCESS,
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.EMAIL_ALREADY_EXISTS,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async signup(
        @Res({ passthrough: true }) response: Response,
        @Body() createReviewerDto: CreateUserProfileDto,
    ) {
        const access_token = await this.authService.signup(createReviewerDto);

        const expiresIn = parseInt(
            this.configService.get<string>("TOKEN_VALIDITY_DURATION_IN_SEC") ||
                "3600000", // fallback
            10,
        );

        response.cookie("token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: expiresIn, // 1 hour
            path: "/",
        });

        return createResponse(
            ResponseCodesEnum.CREATED,
            ResponseMessagesEnum.SIGNUP_SUCCESS,
        );
    }

    @Post("login")
    @ApiOperation({ summary: "Login User" })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.LOGIN_SUCCESS,
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.BAD_REQUEST,
    })
    @ApiResponse({
        status: ResponseCodesEnum.BAD_REQUEST,
        description: ResponseMessagesEnum.INVALID_DETAILS,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async login(
        @Res({ passthrough: true }) response: Response,
        @Body() loginDto: LoginUserDto,
    ) {
        const access_token = await this.authService.login(loginDto);

        const expiresIn = parseInt(
            this.configService.get<string>("TOKEN_VALIDITY_DURATION_IN_SEC") ||
                "3600000", // fallback
            10,
        );

        response.cookie("token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: expiresIn, // 1 hour
            path: "/",
        });

        return createResponse(
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.LOGIN_SUCCESS,
        );
    }
}
