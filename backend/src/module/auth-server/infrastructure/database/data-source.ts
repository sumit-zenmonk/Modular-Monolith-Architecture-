//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

//Entities
import { UserEntity } from "src/module/auth-server/domain/user/user.entity";
import { OutboxEntity } from "../../domain/outbox/outbox.entity";

const options: DataSourceOptions = {
    type: process.env.DB_POSTGRES_TYPE as any,
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT as any,
    username: process.env.DB_POSTGRES_USERNAME,
    password: process.env.DB_POSTGRES_PASSWORD,
    database: process.env.DB_POSTGRES_DATABASE,
    entities: [
        UserEntity,OutboxEntity
    ],
    schema: process.env.DB_POSTGRES_AUTH_SCHEMA || 'auth',
    synchronize: false,
    migrations: ['dist/module/auth-server/infrastructure/database/migrations/*{.ts,.js}'],
};

const authdataSource = new DataSource(options);

export { authdataSource, options };