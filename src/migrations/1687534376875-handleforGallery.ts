import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class HandleforGallery1687534376875 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "gallery",
            new TableColumn({
                name: "handle",
                type: "varchar",
                isNullable: true
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
