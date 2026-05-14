//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { UserEntity } from "../../domain/user/user.entity";
import { PostEntity } from "../../domain/post/post.entity";
import { FollowEntity } from "../../domain/follow/follow.entity";
import { OutboxEntity } from "../../domain/outbox/outbox.entity";
import { InboxEntity } from "../../domain/inbox/inbox.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity, PostEntity, FollowEntity, OutboxEntity, InboxEntity
    ],
    schema: process.env.DB_POSTGRES_MAIN_SCHEMA || 'main',
    synchronize: false,
    migrations: ['dist/module/main-server/infrastructure/database/migrations/*{.ts,.js}'],
};

const mainDataSource = new DataSource(options);

export { mainDataSource, options };