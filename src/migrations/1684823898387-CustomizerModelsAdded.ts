import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CustomizerModelsAdded1684823898387 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Custom product
        await queryRunner.createTable(new Table({
            name: 'custom_product',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                },
                {
                    name: 'code',
                    type: 'varchar',
                },
                {
                    name: 'sale_amount',
                    type: 'int',
                    isNullable: true,
                },
                {
                    name: 'sale_start_date',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'sale_end_date',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'template_image',
                    type: 'varchar',
                },
                {
                    name: 'product_id',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                },
            ]
        }));

        await queryRunner.createForeignKey('custom_product',
            new TableForeignKey({
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'product',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE'
            })
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('custom_product', 'FK_product_product_id')
        await queryRunner.dropTable('custom_product')
    }

}
