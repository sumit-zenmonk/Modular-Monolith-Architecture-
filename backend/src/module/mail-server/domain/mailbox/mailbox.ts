import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MailBoxStatusEnum } from "./mailbox.enum";

@Entity('mailbox')
export class MailBoxEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

    @Column({ type: "varchar", nullable: false })
    email: string;

    @Column({
        type: "jsonb",
        nullable: true,
        default: () => "'{}'",
    })
    body: Record<string, any>;

    @Column({
        type: "enum",
        enum: MailBoxStatusEnum,
        default: MailBoxStatusEnum.PENDING
    })
    status: MailBoxStatusEnum;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}