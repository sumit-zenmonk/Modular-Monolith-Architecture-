import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class FollowMigration1778505600002 implements MigrationInterface {
    name = "FollowMigration1778505600002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "follow",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false, },
                    { name: "follower_uuid", type: "uuid", isNullable: false, },
                    { name: "following_uuid", type: "uuid", isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "follow",
            new TableForeignKey({
                name: "FK_FOLLOW_FOLLOWER",
                columnNames: ["follower_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                onDelete: "NO ACTION",
            })
        );

        await queryRunner.createForeignKey(
            "follow",
            new TableForeignKey({
                name: "FK_FOLLOW_FOLLOWING",
                columnNames: ["following_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                onDelete: "NO ACTION",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("follow", "FK_FOLLOW_FOLLOWING");
        await queryRunner.dropForeignKey("follow", "FK_FOLLOW_FOLLOWER");
        await queryRunner.dropTable("follow", true);
    }
}