import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FollowEntity } from "../../domain/follow/follow.entity";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class FollowRepository extends Repository<FollowEntity> {
        constructor(
            @InjectDataSource(process.env.DB_POSTGRES_MAIL_SCHEMA || 'mail')
            private readonly dataSource: DataSource,
        ) {
            super(FollowEntity, dataSource.createEntityManager());
        }

    async createFollowerBond(body: Partial<FollowEntity>) {
        const follow = this.create(body);
        return await this.save(follow);
    }

    async findByUuid(uuid: string) {
        return await this.findOne({
            where: {
                uuid: uuid
            },
            withDeleted: true
        });
    }

    async findByFollowingUuid(following_uuid: string) {
        return await this.find({
            where: {
                following_uuid: following_uuid
            },
            relations: {
                follower: true
            },
            select: {
                uuid: true,
                follower_uuid: true,
                following_uuid: true,
                follower: {
                    uuid: true,
                    email: true,
                    name: true
                }
            }
        });
    }

    async deleteFollowBond(uuid: string) {
        return await this.softDelete({ uuid });
    }
}
