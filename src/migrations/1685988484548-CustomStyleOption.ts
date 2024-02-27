import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from "typeorm";

export class CustomStyleOption1685988484548 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "custom_style_option",
            columns: [
              {
                name: "id",
                type: "varchar",
                isPrimary: true,
              },
              {
                name: "title",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "subtitle",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "image_url",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "price",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "custom_style_id",
                type: "varchar",
              },
              {
                name: "updated_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
            },
            ],
          })
        );
    
        await queryRunner.addColumn(
          "custom_style_option",
          new TableColumn({
            name: "created_at",
            type: "timestamp",
            default: "now()",
          })
        );
    
        await queryRunner.createForeignKey(
          "custom_style_option",
          new TableForeignKey({
            columnNames: ["custom_style_id"],
            referencedTableName: "custom_product_style",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          })
        );
    
        await queryRunner.createTable(
          new Table({
            name: "custom_product_style_product_category",
            columns: [
              {
                name: "custom_product_style_id",
                type: "varchar",
                isNullable: false,
              },
              {
                name: "product_category_id",
                type: "varchar",
                isNullable: false,
              },
            ],
          })
        );
    
        await queryRunner.createForeignKey(
          "custom_product_style_product_category",
          new TableForeignKey({
            columnNames: ["custom_product_style_id"],
            referencedTableName: "custom_product_style",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          })
        );
    
        await queryRunner.createForeignKey(
          "custom_product_style_product_category",
          new TableForeignKey({
            columnNames: ["product_category_id"],
            referencedTableName: "product_category",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
          "custom_product_style_product_category",
          "FK_custom_product_style_product_category_custom_product_style_id"
        );
    
        await queryRunner.dropForeignKey(
          "custom_product_style_product_category",
          "FK_custom_product_style_product_category_product_category_id"
        );
    
        await queryRunner.dropTable("custom_product_style_product_category");
        await queryRunner.dropForeignKey(
          "custom_style_option",
          "FK_custom_style_option_custom_style_id"
        );
    
        await queryRunner.dropColumn("custom_style_option", "created_at");
        await queryRunner.dropTable("custom_style_option");
      }
}
