import { Client } from 'pg';

export async function createSchemas() {
    try {
        const client = new Client({
            host: process.env.DB_POSTGRES_HOST,
            port: Number(process.env.DB_POSTGRES_PORT),
            user: process.env.DB_POSTGRES_USERNAME,
            password: process.env.DB_POSTGRES_PASSWORD,
            database: process.env.DB_POSTGRES_DATABASE,
        });

        await client.connect();

        await client.query(`CREATE SCHEMA IF NOT EXISTS ${process.env.DB_POSTGRES_AUTH_SCHEMA};`);
        await client.query(`CREATE SCHEMA IF NOT EXISTS ${process.env.DB_POSTGRES_MAIL_SCHEMA};`);
        await client.query(`CREATE SCHEMA IF NOT EXISTS ${process.env.DB_POSTGRES_MAIN_SCHEMA};`);

        await client.end();
    }
    catch (err: any) {
        console.log(`Creating Schema Err : ${err}`);
    }
}