import { Controller, Get, Param, Delete, Req, UseGuards } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/security/jwt-auth.guard";
import { ResponseCodesEnum } from "src/common/enums/response-codes.enum";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { createResponse } from "src/common/utils/general-utils";
import { User } from "./model/user.model";

@ApiTags("user")
@Controller("user")
export class UserAccountController {
    constructor(private readonly userService: UserService) {}

    @Get("")
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "GET: logged in user account. Call after login/signup",
    })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.SUCCESS,
        type: User,
    })
    @ApiResponse({
        status: ResponseCodesEnum.UNAUTHORIZED,
        description: ResponseMessagesEnum.UNAUTHORIZED,
    })
    @ApiResponse({
        status: ResponseCodesEnum.NOT_FOUND,
        description: ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async getUser(@Req() req) {
        const id = req.user.userId;
        const user = await this.userService.findUserById(id);

        return createResponse(
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.SUCCESS,
            user,
        );
    }

    @Get(":id")
    @ApiOperation({ summary: "GET: a user account by id" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.SUCCESS,
        type: User,
    })
    @ApiResponse({
        status: ResponseCodesEnum.NOT_FOUND,
        description: ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async findOne(@Param("id") id: string) {
        const user = await this.userService.findUserById(id);

        return createResponse(
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.SUCCESS,
            user,
        );
    }

    @Delete(":id")
    @ApiBearerAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "DELETE: a user account" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({
        status: ResponseCodesEnum.SUCCESS,
        description: ResponseMessagesEnum.ACCOUNT_CLOSED,
    })
    @ApiResponse({
        status: ResponseCodesEnum.NOT_FOUND,
        description: ResponseMessagesEnum.ACCOUNT_NOT_FOUND,
    })
    @ApiResponse({
        status: ResponseCodesEnum.SERVER_ERROR,
        description: ResponseMessagesEnum.SERVER_ERROR,
    })
    async remove(@Req() req) {
        const userId = req.user.userId;
        await this.userService.remove(userId);

        return createResponse(
            ResponseCodesEnum.SUCCESS,
            ResponseMessagesEnum.ACCOUNT_CLOSED,
        );
    }
}
