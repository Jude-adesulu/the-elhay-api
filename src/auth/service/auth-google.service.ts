import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserProfileService } from 'src/user-profile/services/user-profile.service';
import { GoogleUserDto } from '../dto/google-user.dto'; 
import { UserType } from 'src/common/enums/user-type.enum'; 
import { ResponseMessagesEnum } from 'src/common/enums/response-messages.enum';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/model/user.model';
import { CreateUserProfileFromSocialAuthDto } from 'src/user-profile/dto/create-user-profile.dto';

@Injectable()
export class AuthGoogleService {
    private readonly logger = new Logger(AuthGoogleService.name);
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly userProfileService: UserProfileService,
    ) {}

    async oAuthLogin(authenticatedUser: GoogleUserDto, userType?: string) {
        let reviewer = null;
        try {
            if (!authenticatedUser || !authenticatedUser.email) {
                throw new Error(ResponseMessagesEnum.INVALID_GOOGLE_DATA);
            }

            let user = await this.userService.findUserByEmail(
                authenticatedUser.email,
                false,
            );

            if (!user) {
                user = await this.userService.createUser(
                    authenticatedUser.email,
                    "",
                );

                if (userType === UserType.USER) {
                    const newUserProfile: CreateUserProfileFromSocialAuthDto = {
                        first_name: authenticatedUser.first_name,
                        last_name: authenticatedUser.last_name,
                        display_pic: authenticatedUser.picture,
                    };

                    reviewer =
                        await this.userProfileService.createUserProfileFromSocialAuth(
                            user,
                            newUserProfile,
                        );

                    if (!reviewer) {
                        this.logger.error(
                            ResponseMessagesEnum.LOGIN_WITH_GOOGLE_FAILED,
                            { user, newUserProfile },
                        );
                        throw new Error(
                            ResponseMessagesEnum.LOGIN_WITH_GOOGLE_FAILED,
                        );
                    }
                } else {
                    throw new Error(ResponseMessagesEnum.BAD_REQUEST);
                }
            }

            return this.generateToken(user);
        } catch (error) {
            this.logger.error(
                `${ResponseMessagesEnum.LOGIN_WITH_GOOGLE_FAILED}: ${error.message}`,
                error.stack,
            );
            throw new Error(ResponseMessagesEnum.LOGIN_WITH_GOOGLE_FAILED);
        }
    }

    async generateToken(user: User) {
        const payload = {
            email: user.email,
            sub: user.id,
        };

        return this.jwtService.sign(payload);
    }
}