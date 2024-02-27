import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from "typeorm";

export class UpdateMaterials1686066516590 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint for custom_material_id
    await queryRunner.dropColumn("custom_color_group", "custom_material_id");

    // Alter the published column to boolean
    await queryRunner.query(`ALTER TABLE "custom_color_group" ALTER COLUMN "published" TYPE boolean USING published::boolean`);

    // Drop the foreign key constraint for material_type_id
    await queryRunner.dropColumn("custom_material", "material_type_id");

    // Create the custom_material_custom_color_group table
    await queryRunner.createTable(
      new Table({
        name: "custom_material_custom_color_group",
        columns: [
          {
            name: "custom_material_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "custom_color_group_id",
            type: "varchar",
            isNullable: false,
          },
        ],
      })
    );

    // Create the foreign key constraints
    await queryRunner.createForeignKey(
      "custom_material_custom_color_group",
      new TableForeignKey({
        columnNames: ["custom_material_id"],
        referencedTableName: "custom_material",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "custom_material_custom_color_group",
      new TableForeignKey({
        columnNames: ["custom_color_group_id"],
        referencedTableName: "custom_color_group",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraints for custom_material_custom_color_group table
    await queryRunner.dropForeignKey("custom_material_custom_color_group", "FK_custom_material_custom_color_group_custom_material");
    await queryRunner.dropForeignKey("custom_material_custom_color_group", "FK_custom_material_custom_color_group_custom_color_group");

    // Drop the custom_material_custom_color_group table
    await queryRunner.dropTable("custom_material_custom_color_group");

    // Add the custom_material_id column back to custom_color_group table
    await queryRunner.addColumn(
      "custom_color_group",
      new TableColumn({
        name: "custom_material_id",
        type: "varchar",
        isNullable: true,
      })
    );

    // Add the material_type_id column back to custom_material table
    await queryRunner.addColumn(
      "custom_material",
      new TableColumn({
        name: "material_type_id",
        type: "varchar",
        isNullable: true,
      })
    );
  }
}
