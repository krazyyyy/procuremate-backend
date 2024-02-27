import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CustomProductSettings1685604763392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create 'custom_product_settings' table
    await queryRunner.createTable(
      new Table({
        name: "custom_product_settings",
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
            name: "thai_name",
            type: "varchar",
          },
          {
            name: "material_group",
            type: "varchar",
          },
          {
            name: "muay_thai",
            type: "boolean",
          },
          {
            name: "preset_material",
            type: "varchar",
          },
          {
            name: "product_id",
            type: "varchar",
            isNullable: true, // Set the column to allow null values
          },
          {
            name: "customizer_area_id",
            type: "varchar",
            isNullable: true, // Set the column to allow null values
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    // Add foreign key constraint for 'custom_product_id'
    await queryRunner.createForeignKey(
      "custom_product_settings",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product",
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    );

    // Add foreign key constraint for 'customizer_area_id'
    await queryRunner.createForeignKey(
      "custom_product_settings",
      new TableForeignKey({
        columnNames: ["customizer_area_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customizer_area",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint for 'product_id'
    await queryRunner.dropForeignKey(
      "custom_product_settings",
      "FK_custom_product_settings_product_id"
    );

    // Drop foreign key constraint for 'customizer_area_id'
    await queryRunner.dropForeignKey(
      "custom_product_settings",
      "FK_custom_product_settings_customizer_area_id"
    );

    // Drop 'custom_product_settings' table
    await queryRunner.dropTable("custom_product_settings");
  }
}
