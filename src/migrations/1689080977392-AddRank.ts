import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddRank1689080977392 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "custom_product_settings",
            new TableColumn({
                name: "rank",
                type: "int",
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
