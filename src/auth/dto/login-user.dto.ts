import {
    IsString,
    IsEmail,
    IsOptional,
    IsNotEmpty,
    IsAlphanumeric,
    IsStrongPassword,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty({
        example: "user@example.com",
        description: "must be a valid email address",
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: "[Password123]",
        description: "",
    })
    @IsNotEmpty()
    password: string;
}
