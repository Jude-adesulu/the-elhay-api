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

export class UpdateUserProfileDto {
    @ApiProperty({
        example: "John",
        description: "First Name",
        required: false,
    })
    @IsString()
    @IsOptional()
    first_name?: string;

    @ApiProperty({
        example: "Doe",
        description: "Last Name",
        required: false,
    })
    @IsString()
    @IsOptional()
    last_name?: string;

    @ApiProperty({
        example: "https://cloudinary.com/image?id=394900404",
        description: "display pic url",
        required: false,
    })
    @IsString()
    @IsOptional()
    display_pic?: string;
}
