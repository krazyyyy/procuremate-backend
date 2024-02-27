import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class TextSettings1684840531874 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'text_settings',
                columns: [
                    {
                        type: 'varchar',
                        name: 'id',
                        isPrimary: true,
                    },
                    {
                        type: 'text',
                        name: 'text',
                    },
                    {
                        type: 'varchar',
                        name: 'size',
                    },
                    {
                        type: 'int',
                        name: 'price',
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
        await queryRunner.dropTable('text_settings')
    }

}
