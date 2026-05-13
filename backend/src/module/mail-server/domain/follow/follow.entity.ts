import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity({ name: 'follow' })
export class FollowEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

    @Column({ type: 'uuid', nullable: false })
    follower_uuid: string;

    @ManyToOne(() => UserEntity, (user) => user.following)
    @JoinColumn({ name: 'follower_uuid' })
    follower: UserEntity;

    @Column({ type: 'uuid', nullable: false })
    following_uuid: string;

    @ManyToOne(() => UserEntity, (user) => user.followers)
    @JoinColumn({ name: 'following_uuid' })
    following: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
