import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateGallery1687182873766 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" RENAME COLUMN "categoryId" TO "category_id"`);
        await queryRunner.query(`ALTER TABLE "gallery" RENAME COLUMN "productId" TO "product_id"`);
   
    }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
