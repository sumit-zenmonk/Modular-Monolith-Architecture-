import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { UserEntity } from "../../domain/user/user.entity";
import { UserRoleEnum } from "../../domain/user/user.enum";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_MAIN_SCHEMA || 'main')
        private readonly dataSource: DataSource,
    ) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async register(body: Partial<UserEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findByUuid(uuid: string) {
        const user = await this.findOne({
            where: {
                uuid: uuid
            },
            select: {
                email: true,
                name: true,
                uuid: true,
                role: true
            }
        });
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.find({
            where: {
                email: email
            },
            select: {
                email: true,
                name: true,
                uuid: true,
                password: true,
                role: true
            }
        });
        return user;
    }

    async getCreatorListing(user_uuid: string, offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            where: {
                uuid: Not(user_uuid),
                role: UserRoleEnum.CREATOR
            },
            select: {
                uuid: true,
                name: true,
                email: true,
                role: true
            },
            order: {
                id: "DESC",
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }
}