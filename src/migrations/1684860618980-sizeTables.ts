import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";


export class SizeTables1684860618980 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create SizeGuideKey table
        await queryRunner.createTable(
          new Table({
            name: "size_guide_key",
            columns: [
            {
                name: "id",
                type: "varchar",
                length: "255",
                isPrimary: true,
                },
              {
                name: "column_one",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "column_two",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "column_three",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "column_four",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "type",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "category_id",
                type: "varchar",
                length: "255",
                isNullable: true,
              }
            ],
          }),
          true
        );
    
        await queryRunner.addColumn(
          "size_guide_key",
          new TableColumn({
            name: "created_at",
            type: "timestamp",
            default: "now()",
          })
        );
    
        await queryRunner.addColumn(
          "size_guide_key",
          new TableColumn({
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          })
        );
    
        await queryRunner.createForeignKey(
          "size_guide_key",
          new TableForeignKey({
            columnNames: ["category_id"],
            referencedTableName: "product_category",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          })
        );
    
        // Create SizeGuideValues table
        await queryRunner.createTable(
          new Table({
            name: "size_guide_values",
            columns: [
            {
                name: "id",
                type: "varchar",
                length: "255",
                isPrimary: true,
                },
              {
                name: "column_one",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "column_two",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "column_three",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "column_four",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "type",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "size_key",
                type: "varchar",
                length: "255",
                isNullable: true,
              },
            ],
          }),
          true
        );
    
        await queryRunner.addColumn(
          "size_guide_values",
          new TableColumn({
            name: "created_at",
            type: "timestamp",
            default: "now()",
          })
        );
    
        await queryRunner.addColumn(
          "size_guide_values",
          new TableColumn({
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          })
        );
    
        await queryRunner.createForeignKey(
          "size_guide_values",
          new TableForeignKey({
            columnNames: ["size_key"],
            referencedTableName: "size_guide_key",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("size_guide_values");
        await queryRunner.dropTable("size_guide_key");
      }
}
