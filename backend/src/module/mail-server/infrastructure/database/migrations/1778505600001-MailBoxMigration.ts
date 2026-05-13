import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class MailBoxMigration1778505600001 implements MigrationInterface {
    name = "MailBoxMigration1778505600001";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "mail"."mail_status_enum" AS ENUM('pending', 'sent', 'failed')`);

        await queryRunner.createTable(
            new Table({
                name: "mailbox",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false, },
                    { name: "email", type: "varchar", isNullable: false, },
                    { name: "body", type: "jsonb", isNullable: true, default: "'{}'", },
                    { name: "status", type: '"mail"."mail_status_enum"', default: `'pending'`, isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("mailbox", true);
        await queryRunner.query(`DROP TYPE IF EXISTS "mail"."mail_status_enum"`);
    }
}