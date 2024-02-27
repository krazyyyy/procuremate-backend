import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateMaterialPublish1686143237993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "custom_material" ALTER COLUMN "published" TYPE boolean USING published::boolean`);
    await queryRunner.query(`ALTER TABLE "custom_material" RENAME COLUMN "material_groups" TO "material_type"`);
    await queryRunner.query(`UPDATE "custom_material" SET "material_type" = NULL WHERE "material_type" = ''`);
    await queryRunner.query(`UPDATE "custom_material" SET "hex_color" = NULL WHERE "material_type" = ''`);
    await queryRunner.query(`UPDATE "custom_material" SET "data_uri" = NULL WHERE "material_type" = ''`);
    await queryRunner.query(`UPDATE "custom_material" SET "price" = NULL WHERE "material_type" = ''`);
    await queryRunner.addColumn(
      "custom_material",
      new TableColumn({
        name: "image_url",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("custom_material", "image_url");
    await queryRunner.query(`ALTER TABLE "custom_material" RENAME COLUMN "material_type" TO "material_groups"`);
    await queryRunner.query(`ALTER TABLE "custom_material" ALTER COLUMN "published" TYPE character varying USING published::character varying`);
  }
}
