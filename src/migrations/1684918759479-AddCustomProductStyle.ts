import { MigrationInterface, Table, QueryRunner } from "typeorm"

export class AddCustomProductStyle1684918759479 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'custom_product_style',
                columns: [
                    {
                        type: 'varchar',
                        name: 'id',
                        isPrimary: true,
                    },
                    {
                        type: 'varchar',
                        name: 'title',
                    },
                    {
                        type: 'text',
                        name: 'description',
                    },
                    {
                        type: 'varchar',
                        name: 'category',
                    },
                    {
                        type: 'varchar',
                        name: 'type',
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
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('custom_product_style')
    }

}
