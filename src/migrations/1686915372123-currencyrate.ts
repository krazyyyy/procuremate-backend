import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class Currencyrate1686915372123 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
          'currency', // Replace 'currency' with the actual table name if different
          new TableColumn({
            name: 'rate',
            type: 'varchar',
            isNullable: true,
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('currency', 'rate');
      }
}
