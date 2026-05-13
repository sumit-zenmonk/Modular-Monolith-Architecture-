import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class PostMigration1778505600001 implements MigrationInterface {
    name = "PostMigration1778505600001";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "post",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false, },
                    { name: "title", type: "varchar", isNullable: false, },
                    { name: "content", type: "text", isNullable: false, },
                    { name: "user_uuid", type: "uuid", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "post",
            new TableForeignKey({
                name: "FK_POST_USER",
                columnNames: ["user_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                onDelete: "NO ACTION",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("post", "FK_POST_USER");
        await queryRunner.dropTable("post", true);
    }
}