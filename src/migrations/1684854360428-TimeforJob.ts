import { MigrationInterface, QueryRunner } from "typeorm"

export class TimeforJob1684854360428 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "job_cards"
          ADD COLUMN "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
    
        await queryRunner.query(`
          ALTER TABLE "job_cards"
          ADD COLUMN "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          ALTER TABLE "job_cards"
          DROP COLUMN "created_at"
        `);
    
        await queryRunner.query(`
          ALTER TABLE "job_cards"
          DROP COLUMN "updated_at"
        `);
      }

}
