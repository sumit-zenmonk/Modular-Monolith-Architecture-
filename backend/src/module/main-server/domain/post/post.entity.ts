import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    title: string;

    @Column({ type: "text", nullable: false })
    content: string;

    @Column({ type: 'uuid', nullable: false })
    user_uuid: string;

    @ManyToOne(() => UserEntity, (user) => user.posts)
    @JoinColumn({ name: 'user_uuid' })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
