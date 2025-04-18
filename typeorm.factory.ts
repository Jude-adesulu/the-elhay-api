// src/database/createTypeOrmDataSource.ts
import { DataSource, DataSourceOptions } from "typeorm";
import { UserProfile } from "src/user-profile/models/user-profile.model";
import { User } from "src/user/model/user.model";
import { Token } from "src/token/model/token.model";
import { Admin } from "@/admin/models/admin.model";
// import other entities...

const options: DataSourceOptions = {
    type: "mysql",
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    logging: false,
    synchronize: false,
    entities: [User, Token, UserProfile, Admin],
    migrations: ["src/database/migrations/*.ts"],
};

export const AppDataSource = new DataSource(options); // <-- 👈 this is for TypeORM CLI

// Optional helper function for dynamic use in NestJS context
export default function createTypeOrmDataSource(): DataSource {
    return AppDataSource;
}
