import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CustomSizeTable1685450060205 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'custom_sizing',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                ],
            })
        );

        await queryRunner.addColumn(
            'custom_product_sizing',
            new TableColumn({
                name: 'custom_sizes_id',
                type: 'varchar',
                isNullable: true,
            })
        );

        await queryRunner.createForeignKey(
            'custom_product_sizing',
            new TableForeignKey({
                columnNames: ['custom_sizes_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'custom_sizing',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('custom_product_sizing', 'FK_custom_product_sizing_custom_sizing');
        await queryRunner.dropColumn('custom_product_sizing', 'custom_sizes_id');
        await queryRunner.dropTable('custom_sizing');
    }
}
