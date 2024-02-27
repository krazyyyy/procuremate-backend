import { MigrationInterface, Table, QueryRunner } from "typeorm"

export class AddCustomizerGraphic1684871521489 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'customizer_graphic',
                columns: [
                    {
                        type: 'varchar',
                        name: 'id',
                        isPrimary: true,
                    },
                    {
                        type: 'varchar',
                        name: 'flag_price',
                    },
                    {
                        type: 'varchar',
                        name: 'graphic_price',
                    },
                    {
                        type: 'varchar',
                        name: 'upload_price',
                    },
                    {
                        type: 'varchar',
                        name: 'muay_thai',
                    },
                    {
                        type: 'varchar',
                        name: 'remove_boxer_logo',
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
        await queryRunner.dropTable('customizer_graphic')
    }

}
