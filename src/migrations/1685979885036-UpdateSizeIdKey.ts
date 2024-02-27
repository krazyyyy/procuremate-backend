import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateSizeIdKey1685979885036 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DO $$
        BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'custom_product_sizing' -- Table name
          AND column_name = 'custom_sizesId' -- Column name
        ) THEN
          ALTER TABLE custom_product_sizing RENAME COLUMN "custom_sizesId" TO "custom_sizes_id";
        END IF;
      END $$;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE custom_product_sizing RENAME COLUMN "custom_sizes_id" TO "custom_sizesId"`
    );
  }
}
