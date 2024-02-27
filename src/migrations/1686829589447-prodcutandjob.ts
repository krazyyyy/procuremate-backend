import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class Prodcutandjob1686829589447 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create job_cards_comment table
        await queryRunner.createTable(
          new Table({
            name: "job_cards_comment",
            columns: [
              {
                name: "id",
                type: "varchar",
                isPrimary: true,
              },
              {
                name: "comment",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "job_card_id",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
              },
              {
                name: "updated_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
              },
            ],
          })
        );

    
        await queryRunner.createForeignKey(
          "job_cards_comment",
          new TableForeignKey({
            columnNames: ["job_card_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "job_cards",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          })
        );

        // Create production table
        await queryRunner.createTable(
            new Table({
                name: "production",
                columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true,
                },
                {
                    name: "production_info",
                    type: "varchar",
                    isNullable: true,
    
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                ],
            })
        );
    
        // Create production_type table
        await queryRunner.createTable(
          new Table({
            name: "production_type",
            columns: [
              {
                name: "id",
                type: "varchar",
                isPrimary: true,
              },
              {
                name: "title",
                type: "varchar",
              },
              {
                name: "description",
                type: "text",
                isNullable: true,
              },
              {
                name: "price",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "days",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "email_title",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "express_shipping",
                type: "boolean",
                default: false,
              },
              {
                name: "production_id",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
              },
              {
                name: "updated_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
              },
            ],
          })
        );
    
        await queryRunner.createForeignKey(
          "production_type",
          new TableForeignKey({
            columnNames: ["production_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "production",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          })
        );
    


        await queryRunner.addColumn(
            "job_cards",
            new TableColumn({
              name: "comment",
              type: "varchar",
              isNullable: true,
            })
          );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop production table
        await queryRunner.dropTable("production");
    
        // Drop production_type table
        const productionTypeTable = await queryRunner.getTable("production_type");
        const productionTypeForeignKey = productionTypeTable.foreignKeys.find(
          (fk) => fk.columnNames.indexOf("production_id") !== -1
        );
        await queryRunner.dropForeignKey("production_type", productionTypeForeignKey);
        await queryRunner.dropColumn("production_type", "production_id");
        await queryRunner.dropTable("production_type");
    
        // Drop job_cards_comment table
        const jobCardsCommentTable = await queryRunner.getTable("job_cards_comment");
        const jobCardsCommentForeignKey = jobCardsCommentTable.foreignKeys.find(
          (fk) => fk.columnNames.indexOf("job_card_id") !== -1
        );
        await queryRunner.dropForeignKey("job_cards_comment", jobCardsCommentForeignKey);
        await queryRunner.dropColumn("job_cards_comment", "job_card_id");
        await queryRunner.dropTable("job_cards_comment");

        await queryRunner.dropColumn("job_cards", "comment");
      }
}
