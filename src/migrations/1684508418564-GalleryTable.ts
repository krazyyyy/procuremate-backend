import { MigrationInterface, QueryRunner } from "typeorm"

export class GalleryTable1684508418564 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `CREATE TABLE "gallery" (
              "id" SERIAL NOT NULL,
              "title" text NOT NULL,
              "description" text NOT NULL,
              "images" jsonb NOT NULL,
              "categoryId" character varying,
              "productId" character varying,
              CONSTRAINT "PK_7234237575ebb1ef784c040b8ae" PRIMARY KEY ("id")
            )`
        );
    
        await queryRunner.query(
          `ALTER TABLE "gallery"
            ADD CONSTRAINT "FK_31ddcb0ca9e52df3bdc778e7129" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    
        await queryRunner.query(
          `ALTER TABLE "gallery"
            ADD CONSTRAINT "FK_20f6c6419aa4f5bcf5133005242" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `ALTER TABLE "gallery" DROP CONSTRAINT "FK_31ddcb0ca9e52df3bdc778e7129"`
        );
    
        await queryRunner.query(
          `ALTER TABLE "gallery" DROP CONSTRAINT "FK_20f6c6419aa4f5bcf5133005242"`
        );
    
        await queryRunner.query(`DROP TABLE "gallery"`);
      }
}
