import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfile } from "./models/user-profile.model";
import { UserProfileService } from "./services/user-profile.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserProfile])],
    providers: [UserProfileService],
    controllers: [],
    exports: [TypeOrmModule, UserProfileService],
})
export class UserProfileModule {}
