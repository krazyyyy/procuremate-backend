import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class EmailTemplate1687186785997 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "email_template",
            columns: [
              {
                name: "id",
                type: "varchar",
                isPrimary: true,
              },
              {
                name: "name",
                type: "varchar",
              },
              {
                name: "type",
                type: "varchar",
              },
              {
                name: "description",
                type: "varchar",
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
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("email_template");
      }
}
