import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
const CUSTOM_SIZING_TABLE = 'custom_product_sizing';
export class CustomSizingChanged1685449375995 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add price_adjust column to custom_sizing_table
        await queryRunner.addColumn(
            CUSTOM_SIZING_TABLE,
            new TableColumn({
                name: 'price_adjust',
                type: 'varchar',
            })
        );

        // Remove categories column from custom_sizing_table
        await queryRunner.dropColumn(CUSTOM_SIZING_TABLE, 'categories');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Restore categories column in custom_sizing_table
        await queryRunner.addColumn(
            CUSTOM_SIZING_TABLE,
            new TableColumn({
                name: 'categories',
                type: 'varchar',
            })
        );

        // Remove price_adjust column from custom_sizing_table
        await queryRunner.dropColumn(CUSTOM_SIZING_TABLE, 'price_adjust');
    }

}
