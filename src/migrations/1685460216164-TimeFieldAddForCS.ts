import { MigrationInterface, QueryRunner } from "typeorm"

export class TimeFieldAddForCS1685460216164 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "custom_sizing"
          ADD COLUMN "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    
        await queryRunner.query(`
          ALTER TABLE "custom_sizing"
          ADD COLUMN "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "custom_sizing"
          DROP COLUMN "created_at"
        `);
    
        await queryRunner.query(`
          ALTER TABLE "custom_sizing"
          DROP COLUMN "updated_at"
        `);
      }


}
