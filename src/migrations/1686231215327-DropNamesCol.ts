import { MigrationInterface, QueryRunner } from "typeorm"

export class DropNamesCol1686231215327 implements MigrationInterface {

    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("customizer_name", "product_types");
        await queryRunner.dropColumn("customizer_name", "custom_product_sizing_id");
        await queryRunner.query(`UPDATE "customizer_name" SET "description" = NULL WHERE "description" = ''`);
        await queryRunner.query(`UPDATE "customizer_name" SET "internal_description" = NULL WHERE "internal_description" = ''`);
        await queryRunner.query(`UPDATE "customizer_name" SET "character_limit" = NULL WHERE "character_limit" = ''`);
    
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
