import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";


export class JobCards1684847505425 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "job_cards",
            columns: [
              {
                name: "id",
                type: "varchar",
                length: "36",
                isPrimary: true,
              },
              {
                name: "type",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "fight_date",
                type: "date",
                isNullable: true,
              },
              {
                name: "product_id",
                type: "varchar",
                length: "36",
                isNullable: true,
              },
              {
                name: "order_id",
                type: "varchar",
                length: "36",
                isNullable: true,
              },
            ],
          })
        );
    
        await queryRunner.createForeignKey(
          "job_cards",
          new TableForeignKey({
            columnNames: ["product_id"],
            referencedTableName: "product",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          })
        );
    
        await queryRunner.createForeignKey(
          "job_cards",
          new TableForeignKey({
            columnNames: ["order_id"],
            referencedTableName: "order",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("job_cards", "FK_product_id_products");
        await queryRunner.dropForeignKey("job_cards", "FK_order_id_orders");
        await queryRunner.dropTable("job_cards");
      }

}
