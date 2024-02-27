import { MigrationInterface, QueryRunner, TableForeignKey, TableColumn } from "typeorm";

export class GraphicSizeUpdate1686396941418 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.dropForeignKey("graphic_size", "FK_352826e0af49bd2d3bfb4910ba7");

    // Create a new foreign key constraint with the updated reference
    await queryRunner.createForeignKey(
      "graphic_size",
      new TableForeignKey({
        name: "FK_352826e0af49bd2d3bfb4910ba7",
        columnNames: ["graphic_id"],
        referencedTableName: "graphic_main",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {


  }
}
