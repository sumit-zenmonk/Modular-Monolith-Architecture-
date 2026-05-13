import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRoleEnum } from "./user.enum";
import { PostEntity } from "../post/post.entity";
import { FollowEntity } from "../follow/follow.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

    @Column({ type: "varchar", nullable: false, })
    name: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    email: string;

    @Column({ type: "varchar", nullable: false })
    password: string;

    @Column({
        type: "enum",
        enum: UserRoleEnum,
        default: UserRoleEnum.USER
    })
    role: UserRoleEnum;

    @OneToMany(() => PostEntity, (post) => post.user)
    posts: PostEntity[];

    @OneToMany(() => FollowEntity, (follow) => follow.follower)
    following: FollowEntity[];

    @OneToMany(() => FollowEntity, (follow) => follow.following)
    followers: FollowEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}