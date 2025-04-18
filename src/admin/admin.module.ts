import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "./models/admin.model";

@Module({
    imports: [TypeOrmModule.forFeature([Admin])],
    providers: [],
    controllers: [],
    exports: [TypeOrmModule],
})
export class AdminModule {}
