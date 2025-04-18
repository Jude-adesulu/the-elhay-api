import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
    OneToMany,
    BeforeInsert,
} from "typeorm";
import { v4 as uuidv4 } from "uuid"; // You'll need to install this package
import { Token } from "src/token/model/token.model";
import { UserProfile } from "src/user-profile/models/user-profile.model";
import { Admin } from "src/admin/models/admin.model";

@Entity({ name: "users" })
export class User {
    @PrimaryColumn("uuid")
    id: string;

    @BeforeInsert()
    generateUuid() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }

    @Column({ type: "varchar", nullable: false })
    email: string;

    @Column({ type: "varchar", nullable: false })
    password: string;

    @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
        onDelete: "CASCADE",
    })
    userProfile: UserProfile;

    @OneToOne(() => Admin, (admin) => admin.user, {
        onDelete: "CASCADE",
    })
    admin: Admin;

    @OneToMany(() => Token, (token) => token.user, { onDelete: "CASCADE" })
    token: Token[];

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deleted_at?: Date;

    @Column({ type: "boolean", default: false })
    is_email_verified: boolean;
}
