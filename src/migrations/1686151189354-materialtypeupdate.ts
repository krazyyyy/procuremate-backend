import { MigrationInterface, QueryRunner } from "typeorm"

export class Materialtypeupdate1686151189354 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("material_type", "customizer_color_group_id");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Re-adding the column is not necessary as it was removed permanently
    }

}
