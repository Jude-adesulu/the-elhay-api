import { Module } from "@nestjs/common";
import { UserAccountController } from "./user.controller";
import { PassportModule } from "@nestjs/passport";
import { PasswordService } from "src/common/services/password.service";
import { User } from "./model/user.model";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([User]), PassportModule],
    providers: [UserService, PasswordService],
    controllers: [UserAccountController],
    exports: [UserService, TypeOrmModule],
})
export class UserModule {}
