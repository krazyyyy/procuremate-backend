import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm"

export class AddedcustomidinJob1686965328932 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "job_cards",
            new TableColumn({
                name: "custom_design_id",
                type: "varchar",
                isNullable: true
            })
        );

        await queryRunner.createForeignKey(
            "job_cards",
            new TableForeignKey({
                columnNames: ["custom_design_id"],
                referencedTableName: "custom_design",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("job_cards", "FK_job_cards_custom_design_id");
        await queryRunner.dropColumn("job_cards", "custom_design_id");
    }
}
