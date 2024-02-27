import { MigrationInterface, QueryRunner, TableForeignKey, Table, TableColumn } from "typeorm"

export class CustomDesign1686569276308 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create the "custom_design" table
        await queryRunner.createTable(new Table({
          name: "custom_design",
          columns: [
            {
              name: "id",
              type: "varchar",
              isPrimary: true,
            },
            {
              name: "template_url",
              type: "varchar",
              isNullable: true
            },
            {
              name: "design_data",
              type: "jsonb",
              default: "'{}'"
            },
            {
              name: "product_id",
              type: "varchar",
              isNullable: true
            },
            {
              name: "customer_id",
              type: "varchar",
              isNullable: true
            },
            {
                name: "updated_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                onUpdate: "CURRENT_TIMESTAMP",
            },
            {
                name: "created_at",
                type: "timestamp",
                default: "now()",
            },
          ]
        }));
    


        // Add foreign key constraint for "product_id"
        await queryRunner.createForeignKey("custom_design", new TableForeignKey({
          columnNames: ["product_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "product",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }));
    
        // Add foreign key constraint for "customer_id"
        await queryRunner.createForeignKey("custom_design", new TableForeignKey({
          columnNames: ["customer_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "customer",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }));
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.dropForeignKey("custom_design", "product_id");
        await queryRunner.dropForeignKey("custom_design", "customer_id");
    
        // Drop the "custom_design" table
        await queryRunner.dropTable("custom_design");
      }
}
