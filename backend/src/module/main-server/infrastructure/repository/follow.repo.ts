import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { FollowEntity } from "../../domain/follow/follow.entity";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class FollowRepository extends Repository<FollowEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_MAIN_SCHEMA || 'main')
        private readonly dataSource: DataSource,
    ) {
        super(FollowEntity, dataSource.createEntityManager());
    }

    async createFollowerBond(body: Partial<FollowEntity>) {
        const newFollower = this.create(body);
        return await this.save(newFollower);
    }

    async findByUuid(uuid: string) {
        const follower = await this.find({
            where: {
                uuid: uuid
            },
        });
        return follower;
    }

    async findByFollowerAndFollwoing(follower_uuid: string, following_uuid: string) {
        const follower = await this.findOne({
            where: {
                follower_uuid: follower_uuid,
                following_uuid: following_uuid
            },
        });
        return follower;
    }

    async GetFollowingListing(user_uuid: string, offset?: number, limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;

        const [data, total] = await this.findAndCount({
            where: {
                follower_uuid: user_uuid
            },
            relations: {
                following: true
            },
            select: {
                uuid: true,
                created_at: true,
                following: {
                    uuid: true,
                    name: true,
                    email: true,
                    role: true,
                    created_at: true
                }
            },
            order: {
                created_at: "DESC"
            },
            skip: curr_offset,
            take: curr_limit
        });

        return { data, total };
    }

    async GetFollowerListing(user_uuid: string, offset?: number, limit?: number) {
        const curr_limit = limit ?? Number(process.env.page_limit) ?? 10;
        const curr_offset = offset ?? Number(process.env.page_offset) ?? 0;

        const [data, total] = await this.findAndCount({
            where: {
                following_uuid: user_uuid
            },
            relations: {
                follower: true
            },
            select: {
                uuid: true,
                created_at: true,
                follower: {
                    uuid: true,
                    name: true,
                    email: true,
                    role: true,
                    created_at: true
                }
            },
            order: {
                created_at: "DESC"
            },
            skip: curr_offset,
            take: curr_limit
        });

        return { data, total };
    }

    async deleteFollowBond(uuid: string) {
        return await this.softDelete({ uuid });
    }
}