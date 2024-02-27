import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class UpdateGallery1687007537919 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE gallery ALTER COLUMN id TYPE VARCHAR`);

        await queryRunner.addColumn(
            "gallery",
            new TableColumn({
                name: "custom_design_id",
                type: "varchar",
                isNullable: true
            })
        );
        await queryRunner.query(`ALTER TABLE gallery DROP CONSTRAINT "FK_20f6c6419aa4f5bcf5133005242"`);
        await queryRunner.query(`ALTER TABLE gallery DROP CONSTRAINT "FK_31ddcb0ca9e52df3bdc778e7129"`);
        

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE gallery ALTER COLUMN id TYPE INT`);
        await queryRunner.dropColumn("gallery", "custom_design_id");
    }

}
