import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class JobCardComment1686928030838 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.addColumn(
            "job_cards",
            new TableColumn({
              name: "design_data",
              type: "jsonb",
              default: "'{}'"
            })
          );
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
