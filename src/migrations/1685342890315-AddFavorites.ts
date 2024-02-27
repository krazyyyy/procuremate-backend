import { MigrationInterface, Table, TableForeignKey, QueryRunner } from "typeorm"

export class AddFavorites1685342890315 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'favorite',
                columns: [
                    {
                        type: 'varchar',
                        name: 'id',
                        isPrimary: true,
                    },
                    {
                        type: 'varchar',
                        name: 'product_id',
                        isNullable: true,
                    },
                    {
                        type: 'varchar',
                        name: 'customer_id',
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
                ],
            }),
            true,
        )
        await queryRunner.createForeignKey('favorite',
            new TableForeignKey({
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'product',
                onDelete: 'CASCADE',
            })
        )
        await queryRunner.createForeignKey('favorite',
            new TableForeignKey({
                columnNames: ['customer_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'customer',
                onDelete: 'CASCADE',
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('favorite', 'FK_favorite_product_id')
        await queryRunner.dropForeignKey('favorite', 'FK_favorite_customer_id')
        await queryRunner.dropTable('favorite')
    }

}
