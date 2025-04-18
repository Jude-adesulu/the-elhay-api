import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";
import { Match } from "src/auth/match.decorator";

export class SignupUserDto {
    @ApiProperty({
        example: "user@example.com",
        description: "must be a valid email address",
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: "password123",
        description: "must be up to 8, alpha-numeric with special chars",
    })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    password: string;

    @ApiProperty({
        example: "password123",
        description: "must match the password above",
    })
    @IsString()
    @Match("password", { message: "Passwords do not match" })
    confirmPassword: string;
}
