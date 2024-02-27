import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateGallery1684764808479 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "gallery"
          ADD COLUMN "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    
        await queryRunner.query(`
          ALTER TABLE "gallery"
          ADD COLUMN "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "gallery"
          DROP COLUMN "created_at"
        `);
    
        await queryRunner.query(`
          ALTER TABLE "gallery"
          DROP COLUMN "updated_at"
        `);
      }

}
