import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class MigrationADDFIELD1686335469353 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.dropColumn("custom_product_sizing", "custom_sizes_id", );
        if (!await queryRunner.hasColumn('custom_product_sizing', 'custom_sizes_id')) {
            await queryRunner.addColumn(
                "custom_product_sizing",
                new TableColumn({
                    name: 'custom_sizes_id',
                    type: 'varchar',
                    isNullable: true
                }))
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("custom_product_sizing", "custom_sizes_id");
    }

}
