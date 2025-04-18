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
    Index,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/user/model/user.model";
import { TokenType } from "src/common/enums/token-type.enum";

@Entity({ name: "tokens" })
export class Token {
    @PrimaryColumn("uuid")
    id: string;

    @BeforeInsert()
    generateUuid() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }

    @Column({ type: "varchar", nullable: false })
    @Index({ unique: true })
    token: string;

    @Column({
        type: "enum",
        enum: TokenType,
        nullable: false,
    })
    type: TokenType;

    @Column({ type: "timestamp", nullable: false })
    expires_at: Date;

    @Column({ type: "uuid", nullable: false })
    user_id: string;

    @ManyToOne(() => User, (user) => user.token, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: User;

    @CreateDateColumn({ name: "created_at" })
    created_at: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at: Date;

    @DeleteDateColumn({ name: "deleted_at", nullable: true })
    deleted_at?: Date;
}
