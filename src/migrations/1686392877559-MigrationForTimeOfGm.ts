import { MigrationInterface, QueryRunner } from "typeorm"

export class MigrationForTimeOfGm1686392877559 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "graphic_main"
          ADD COLUMN "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    
        await queryRunner.query(`
          ALTER TABLE "graphic_main"
          ADD COLUMN "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "graphic_main"
          DROP COLUMN "created_at"
        `);
    
        await queryRunner.query(`
          ALTER TABLE "graphic_main"
          DROP COLUMN "updated_at"
        `);
      }

}
