import {
    IsString,
    IsEmail,
    IsOptional,
    IsNotEmpty,
    IsAlphanumeric,
    IsStrongPassword,
    Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Match } from "src/auth/match.decorator";

export class CreateUserProfileDto {
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

    @ApiProperty({
        example: "John",
        description: "First Name",
    })
    @IsString()
    @IsOptional()
    first_name: string;

    @ApiProperty({
        example: "Doe",
        description: "Last Name",
    })
    @IsString()
    @IsOptional()
    last_name: string;
}

export class CreateUserProfileFromSocialAuthDto {
    @ApiProperty({
        example: "John",
        description: "First Name",
    })
    @IsString()
    @IsOptional()
    first_name: string;

    @ApiProperty({
        example: "Doe",
        description: "Last Name",
    })
    @IsString()
    @IsOptional()
    last_name: string;

    @ApiProperty({
        example: "https://cdn.com",
        description: "not more than 255 chars",
    })
    @IsString()
    @IsOptional()
    display_pic?: string;
}
