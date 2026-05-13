//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';
import { UserEntity } from "../../domain/user/user.entity";
import { FollowEntity } from "../../domain/follow/follow.entity";
import { MailBoxEntity } from "../../domain/mailbox/mailbox";

//Entities

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity,
        FollowEntity,
        MailBoxEntity
    ],
    schema:process.env.DB_POSTGRES_MAIL_SCHEMA,
    synchronize: false,
    migrations: ['dist/module/mail-server/infrastructure/database/migrations/*{.ts,.js}'],
};

const mailDataSource = new DataSource(options);

export { mailDataSource, options };