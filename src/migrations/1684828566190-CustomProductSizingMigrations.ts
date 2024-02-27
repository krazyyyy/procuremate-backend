import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

const CUSTOM_SIZING_TABLE = 'custom_product_sizing';
const SIZE_TABLE = 'size_table';
export class CustomProductSizingMigrations1684828566190 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Custom product table
        await queryRunner.createTable(
            new Table({
                name: CUSTOM_SIZING_TABLE,
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
                    {
                        name: 'categories',
                        type: 'varchar',
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
            })
        );
        // create sizing table
        await queryRunner.createTable(
            new Table({
                name: SIZE_TABLE,
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
                    {
                        name: 'price_adjust',
                        type: 'varchar',
                    },
                    {
                        name: 'custom_product_sizing_id',
                        type: 'varchar',
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
            })
        );

        await queryRunner.createForeignKey(SIZE_TABLE,
            new TableForeignKey({
                columnNames: ['custom_product_sizing_id'],
                referencedColumnNames: ['id'],
                referencedTableName: CUSTOM_SIZING_TABLE,
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            })
        )

    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(SIZE_TABLE, 'FK_custom_product_sizing_custom_product_sizing_id')
        await queryRunner.dropTable(SIZE_TABLE)
        await queryRunner.dropTable(CUSTOM_SIZING_TABLE)
    }

}
