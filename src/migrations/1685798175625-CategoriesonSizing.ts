import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CategoriesonSizing1685798175625 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "custom_sizing_product_category",
            columns: [
              {
                name: "custom_sizing_id",
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
    
        await queryRunner.createForeignKeys("custom_sizing_product_category", [
          new TableForeignKey({
            columnNames: ["custom_sizing_id"],
            referencedTableName: "custom_sizing",
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
        ]);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("custom_sizing_product_category");
      }
}
