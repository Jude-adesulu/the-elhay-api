import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeInsert,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/user/model/user.model";

@Entity({ name: "user_profile" })
export class UserProfile {
    @PrimaryColumn("uuid")
    id: string;

    @BeforeInsert()
    generateUuid() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }

    @Column({ type: "varchar", nullable: false })
    first_name: string;

    @Column({ type: "varchar", nullable: false })
    last_name: string;

    @Column({ type: "varchar", nullable: true, default: null })
    display_pic: string;

    @Column({ type: "uuid", nullable: false })
    user_id: string;

    @ManyToOne(() => User, (user) => user.userProfile, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deleted_at?: Date;
}
