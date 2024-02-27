import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class GraphicTable1684768867339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create graphic table
    await queryRunner.createTable(
      new Table({
        name: "graphic",
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
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
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

    // Create graphic_size table
    await queryRunner.createTable(
      new Table({
        name: "graphic_size",
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
            name: "description",
            type: "text",
          },
          {
            name: "price",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "graphic_id",
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
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop graphic and graphic_size tables
    await queryRunner.dropTable("graphic");
    await queryRunner.dropTable("graphic_size");
  }
}
