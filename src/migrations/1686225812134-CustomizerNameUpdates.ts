import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn } from "typeorm";

export class CustomizerNameUpdates1686225812134 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add columns to the customizer_name table
        await queryRunner.addColumn(
            'customizer_name',
            new TableColumn({
                name: 'can_have_crystals',
                type: 'boolean',
                default: false,
                isNullable: false,
            })
        );

        await queryRunner.addColumn(
            'customizer_name',
            new TableColumn({
                name: 'can_have_patch',
                type: 'boolean',
                default: false,
                isNullable: false,
            })
        );

        await queryRunner.addColumn(
            'customizer_name',
            new TableColumn({
                name: 'allow_special_finishes',
                type: 'boolean',
                default: false,
                isNullable: false,
            })
        );

        // Create customizer_name_material_type table
        await queryRunner.createTable(
            new Table({
                name: 'customizer_name_material_type',
                columns: [
                    {
                        name: 'customizer_name_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'material_type_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                ],
            }),
            true // Set `true` if you want to create a foreign key constraint
        );

        // Create foreign key for customizer_name_material_type.customizer_name_id
        await queryRunner.createForeignKey(
            'customizer_name_material_type',
            new TableForeignKey({
                columnNames: ['customizer_name_id'],
                referencedTableName: 'customizer_name',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        );

        // Create foreign key for customizer_name_material_type.material_type_id
        await queryRunner.createForeignKey(
            'customizer_name_material_type',
            new TableForeignKey({
                columnNames: ['material_type_id'],
                referencedTableName: 'material_type',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        );

        // Create customizer_name_product_category table
        await queryRunner.createTable(
            new Table({
                name: 'customizer_name_product_category',
                columns: [
                    {
                        name: 'customizer_name_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'product_category_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                ],
            }),
            true // Set `true` if you want to create a foreign key constraint
        );

        // Create foreign key for customizer_name_product_category.customizer_name_id
        await queryRunner.createForeignKey(
            'customizer_name_product_category',
            new TableForeignKey({
                columnNames: ['customizer_name_id'],
                referencedTableName: 'customizer_name',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        );

        // Create foreign key for customizer_name_product_category.product_category_id
        await queryRunner.createForeignKey(
            'customizer_name_product_category',
            new TableForeignKey({
                columnNames: ['product_category_id'],
                referencedTableName: 'product_category',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop columns from the customizer_name table
        await queryRunner.dropColumn('customizer_name', 'can_have_crystals');
        await queryRunner.dropColumn('customizer_name', 'can_have_patch');
        await queryRunner.dropColumn('customizer_name', 'allow_special_finishes');

        // Drop customizer_name_material_type table
        await queryRunner.dropTable('customizer_name_material_type');

        // Drop customizer_name_product_category table
        await queryRunner.dropTable('customizer_name_product_category');
    }
}
