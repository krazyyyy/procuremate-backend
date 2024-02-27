import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from "typeorm";

export class GraphicMain1686382101452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create graphic_main table
    await queryRunner.createTable(
      new Table({
        name: "graphic_main",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "type",
            type: "varchar",
            isNullable: true,
          },
        ],
      })
    );

    // Create graphic_main_product_category table
    await queryRunner.createTable(
      new Table({
        name: "graphic_main_product_category",
        columns: [
          {
            name: "graphic_main_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "product_category_id",
            type: "varchar",
            isNullable: false,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ["graphic_main_id"],
            referencedTableName: "graphic_main",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          }),
          new TableForeignKey({
            columnNames: ["product_category_id"],
            referencedTableName: "product_category",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          }),
        ],
      })
    );

    // Add image_url column to graphic_main table
    await queryRunner.addColumn(
      "graphic",
      new TableColumn({
        name: "image_url",
        type: "varchar",
        isNullable: true,
      })
    );

    // Add image_url column to custom_color_group table
    await queryRunner.addColumn(
      "custom_color_group",
      new TableColumn({
        name: "image_url",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop image_url column from graphic_main table
    await queryRunner.dropColumn("graphic_main", "image_url");

    // Drop image_url column from custom_color_group table
    await queryRunner.dropColumn("custom_color_group", "image_url");

    // Drop graphic_main_product_category table
    await queryRunner.dropTable("graphic_main_product_category");

    // Drop graphic_main table
    await queryRunner.dropTable("graphic_main");
  }
}
