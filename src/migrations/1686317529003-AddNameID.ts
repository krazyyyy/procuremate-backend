import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddNameID1686317529003 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "custom_product_settings",
            new TableColumn({
                name: 'name_id',
                type: 'varchar',
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
