import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { User } from "src/user/model/user.model";
import { ResponseMessagesEnum } from "src/common/enums/response-messages.enum";
import { UserProfile } from "../models/user-profile.model";
import { CreateUserProfileDto, CreateUserProfileFromSocialAuthDto } from "../dto/create-user-profile.dto";
import { UpdateUserProfileDto } from "../dto/update-user-profile.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class UserProfileService {
    private readonly logger = new Logger(UserProfileService.name);

    constructor(
        @InjectRepository(UserProfile)
        private userProfileRepository: Repository<UserProfile>,
    ) {}

    async createUserProfile(
        user: User,
        userProfileDto: CreateUserProfileDto,
        options?: { transaction?: EntityManager },
    ): Promise<UserProfile> {
        if (user.admin) {
            throw new ConflictException(ResponseMessagesEnum.EMAIL_ALREADY_EXISTS);
        }

        if (user.userProfile) {
            throw new ConflictException(ResponseMessagesEnum.EMAIL_ALREADY_EXISTS);
        }

        const userProfile = this.userProfileRepository.create({
            first_name: userProfileDto.first_name,
            last_name: userProfileDto.last_name,
            user_id: user.id,
        });

        if (options?.transaction) {
            return options.transaction.save(userProfile);
        }
        
        return this.userProfileRepository.save(userProfile);
    }

    async createUserProfileFromSocialAuth(
        user: User,
        userProfileDto: CreateUserProfileFromSocialAuthDto,
    ): Promise<UserProfile> {
        try {
            if (!user || !user.id) {
                throw new BadRequestException(ResponseMessagesEnum.INVALID_USER);
            }
    
            if (user.admin) {
                throw new ConflictException(ResponseMessagesEnum.EMAIL_ALREADY_EXISTS);
            }
    
            // Check if userProfile exists
            let userProfile = await this.userProfileRepository.findOne({
                where: { user_id: user.id }
            });
    
            if (!userProfile) {
                userProfile = this.userProfileRepository.create({
                    first_name: userProfileDto.first_name ? userProfileDto.first_name : "",
                    last_name: userProfileDto.last_name ? userProfileDto.last_name : "",
                    user_id: user.id,
                    display_pic: userProfileDto.display_pic,
                });
                
                await this.userProfileRepository.save(userProfile);
            }
    
            if (!userProfile) {
                throw new Error(ResponseMessagesEnum.LOGIN_WITH_GOOGLE_FAILED);
            }
    
            return userProfile;
        } catch (error) {
            this.logger.error("Error in createUserProfileFromSocialAuth:", error);
            throw error;
        }
    }

    async findUserProfileById(id: string): Promise<UserProfile> {
        const userProfile = await this.userProfileRepository.findOne({
            where: { id },
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    email: true,
                    is_email_verified: true
                }
            }
        });

        if (!userProfile) {
            throw new BadRequestException(
                ResponseMessagesEnum.BAD_REQUEST,
            );
        }

        return userProfile;
    }

    async findUserProfileByUserId(
        user_id: string,
    ): Promise<UserProfile> {
        const userProfile = await this.userProfileRepository.findOne({
            where: { user_id },
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    email: true,
                    is_email_verified: true
                }
            }
        });

        if (!userProfile) {
            throw new BadRequestException(
                ResponseMessagesEnum.BAD_REQUEST,
            );
        }

        return userProfile;
    }

    async updateUserProfile(
        userId: string,
        data: UpdateUserProfileDto,
    ): Promise<UserProfile> {
        // this would throw bad request exception if userId not found
        const userProfile = await this.findUserProfileByUserId(userId);

        // Update user profile
        await this.userProfileRepository.update(
            { id: userProfile.id, user_id: userId },
            data
        );
        
        // Fetch the updated profile
        const updatedUserProfile = await this.userProfileRepository.findOne({
            where: { id: userProfile.id }
        });

        if (!updatedUserProfile) {
            throw new BadRequestException(
                ResponseMessagesEnum.BAD_REQUEST,
            );
        }

        return updatedUserProfile;
    }
}
