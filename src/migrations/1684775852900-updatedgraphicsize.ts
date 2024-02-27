import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class Updatedgraphicsize1684775852900 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
          "graphic_size",
          new TableForeignKey({
            columnNames: ["graphic_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "graphic",
            onDelete: "SET NULL", // or choose the appropriate action for deletion
            onUpdate: "CASCADE", // or choose the appropriate action for update
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("graphic_size", "FK_graphic_size_graphic_id");
      }
}
