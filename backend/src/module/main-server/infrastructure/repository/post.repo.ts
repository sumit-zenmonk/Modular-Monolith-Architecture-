import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { PostEntity } from "../../domain/post/post.entity";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class PostRepository extends Repository<PostEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_MAIN_SCHEMA || 'main')
        private readonly dataSource: DataSource,
    ) {
        super(PostEntity, dataSource.createEntityManager());
    }

    async createPost(body: Partial<PostEntity>) {
        const post = this.create(body);
        return await this.save(post);
    }

    async findByUuid(uuid: string) {
        const user = await this.findOne({
            where: {
                uuid: uuid
            }
        });
        return user;
    }

    async deletePost(uuid: string) {
        return await this.softDelete({ uuid });
    }

    async getCreatorPostListing(user_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                user_uuid
            },
            order: {
                created_at: "DESC",
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async getUserPostListing(user_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                user: {
                    followers: {
                        follower_uuid: user_uuid
                    }
                }
            },
            relations: {
                user: {
                    followers: true
                }
            },
            select: {
                uuid: true,
                title: true,
                content: true,
                user_uuid: true,
                created_at: true,
                updated_at: true,
                deleted_at: true,
                user: {
                    name: true,
                    email: true,
                    created_at: true,
                    updated_at: true,
                    deleted_at: true,
                    followers: false
                }
            },
            order: {
                created_at: "DESC",
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }
}