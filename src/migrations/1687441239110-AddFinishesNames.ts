import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm"

export class AddFinishesNames1687441239110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "customizer_name_crystal",
            columns: [
              {
                name: "id",
                type: "varchar",
                isPrimary: true
              },
              {
                name: "description",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "price",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "material_type",
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
    
        await queryRunner.createTable(
          new Table({
            name: "customizer_name_finishes",
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
                name: "price",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "is_three_d",
                type: "boolean",
                default: false,
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
        await queryRunner.dropTable("customizer_name_crystal");
        await queryRunner.dropTable("customizer_name_finishes");
      }
}
