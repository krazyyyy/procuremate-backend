import { MigrationInterface, QueryRunner } from "typeorm"
import { sqlTableAlter, SQLColumn } from "../utils/query-helper"

const columns: SQLColumn[] = [
    { type: 'boolean', name: 'published' },
    { type: 'VARCHAR(128)', name: 'seo_title' },
    { type: 'VARCHAR(128)', name: 'page_title' },
    { type: 'VARCHAR(164)', name: 'canonical_url' },
    { type: 'TEXT', name: 'seo_description' },
    { type: 'TEXT', name: 'main_image' },
    { type: 'VARCHAR(128)', name: 'comment' },
];

export class ProductChanges21684436891392 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(sqlTableAlter('product', columns, 'add'))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(sqlTableAlter('product', columns, 'drop'))
    }

}
