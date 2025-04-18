import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsStrongPassword } from "class-validator";
import { Match } from "src/auth/match.decorator";

export class EmailVerificationDto {
    @ApiProperty({
        example:
            "6fe83e984312a891ddb3daeff45488579d7318fb4dfa18c1e761f7cbf9bde372",
        description: "password reset token",
    })
    @IsString()
    token: string;
}
