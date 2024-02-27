import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CustomizerColorUpdate1686222253912 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "customizer_color_group_material_type",
            columns: [
              {
                name: "customizer_color_group_id",
                type: "varchar",
                isNullable: false,
              },
              {
                name: "material_type_id",
                type: "varchar",
                isNullable: false,
              },
            ],
          })
        );
    
        await queryRunner.createForeignKeys("customizer_color_group_material_type", [
          new TableForeignKey({
            columnNames: ["customizer_color_group_id"],
            referencedTableName: "customizer_color_group",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          }),
          new TableForeignKey({
            columnNames: ["material_type_id"],
            referencedTableName: "material_type",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          }),
        ]);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("customizer_color_group_material_type");
      }
}
