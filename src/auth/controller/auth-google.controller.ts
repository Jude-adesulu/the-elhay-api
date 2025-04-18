import {
    Controller,
    Get,
    HttpException,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseCodesEnum } from "src/common/enums/response-codes.enum";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { GoogleOauthGuard } from "../security/google-oauth.guard";
import { AuthGoogleService } from "../service/auth-google.service";
import { Response } from "express";
import { UserType } from "src/common/enums/user-type.enum"; 
import { ConfigService } from "@nestjs/config";

@ApiTags("authenication with google")
@Controller("auth")
export class AuthGoogleController {
    constructor(
        private configService: ConfigService,
        private readonly authGoogleService: AuthGoogleService,
    ) {}

    @Get("/reviewer/google")
    @ApiOperation({
        summary: "Continue with Google. Call this from the frontend only",
    })
    initiateGoogleLogin(@Res({ passthrough: true }) response: Response) {
        const expiresIn = parseInt(
            this.configService.get<string>(
                "TOKEN_VALIDITY_DURATION_IN_SEC",
            ),
            3600000,
        );
        const apiUrl = this.configService.get<string>("FRONTEND_URL");

        // Set SameSite to 'lax' to allow cross-site cookie setting during redirect
        response.cookie("userType", UserType.USER, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", // Changed from 'strict' to 'lax'
            maxAge: expiresIn,
            path: "/",
        });

        return response.redirect(`${apiUrl}/auth/google/login`);
    }

    @Get("google/login")
    @UseGuards(GoogleOauthGuard)
    @ApiOperation({
        summary: "this will be called internally",
    })
    googleLogin() {}

    @Get("google/callback")
    @UseGuards(GoogleOauthGuard)
    @ApiOperation({
        summary: "this will be called by google after auth completion",
    })
    async googleAuthCallback(
        @Req() req,
        @Res({ passthrough: true }) response: Response,
    ) {
        try {
            const userType = req.cookies["userType"];

            if (!userType) {
                throw new Error("User type not found in cookies");
            }

            const access_token = await this.authGoogleService.oAuthLogin(
                req.user,
                userType,
            );

            const expiresIn = parseInt(
                this.configService.get<string>(
                    "TOKEN_VALIDITY_DURATION_IN_SEC",
                ),
                3600000,
            );

            response.cookie("token", access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: expiresIn, // 1 hour
                path: "/",
            });

            // Redirect to frontend after setting cookie
            const frontendURL = this.configService.get<string>("FRONTEND_URL");
            return response.redirect(`${frontendURL}`);
        } catch (error) {
            // Add error handling for the controller
            console.error("Google callback error:", error);
            throw new HttpException(
                error.message || ResponseMessagesEnum.LOGIN_WITH_GOOGLE_FAILED,
                ResponseCodesEnum.SERVER_ERROR,
            );
        }
    }
}
