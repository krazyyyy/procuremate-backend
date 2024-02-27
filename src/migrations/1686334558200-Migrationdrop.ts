import { MigrationInterface, QueryRunner } from "typeorm"

export class Migrationdrop1686334558200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (await queryRunner.hasColumn('custom_sizing', 'custom_sizesId')) {
            await queryRunner.dropColumn("custom_sizing", "custom_sizesId");
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
