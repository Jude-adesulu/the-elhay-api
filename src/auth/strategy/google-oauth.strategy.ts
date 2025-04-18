import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { configDotenv } from "dotenv";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { GoogleUserDto } from "../dto/google-user.dto";

configDotenv();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
            prompt: "consent", // Add this line to force consent screen, remove after testing or when in production
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, name, emails, photos } = profile;

        const user: GoogleUserDto = {
            provider: "google",
            providerId: id,
            email: emails[0].value,
            first_name: name.givenName,
            last_name: name.familyName,
            picture: photos[0].value,
        };

        done(null, user);
    }
}
