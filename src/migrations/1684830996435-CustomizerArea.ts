import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

const CUSTOMIZER_AREA = 'customizer_area';
const CUSTOMIZER_NAME = 'customizer_name';
const CUSTOMIZER_COLOR_GROUP = 'customizer_color_group';
const CUSTOM_COLOR_GROUP = 'custom_color_group';
const CUSTOM_MATERIAL = 'custom_material';
const MATERIAL_TYPE = 'material_type';

export class CustomizerArea1684830996435 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // customizer area
        await queryRunner.createTable(
            new Table({
                name: CUSTOMIZER_AREA,
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'price_adjust',
                        type: 'varchar',
                    },
                    {
                        name: 'optional',
                        type: 'boolean',
                        default: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ]
            })
        );
        // customizer name
        await queryRunner.createTable(
            new Table({
                name: CUSTOMIZER_NAME,
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'description',
                        type: 'text',
                    },
                    {
                        name: 'internal_description',
                        type: 'text',
                    },
                    {
                        name: 'base_price',
                        type: 'varchar',
                    },
                    {
                        name: 'price',
                        type: 'varchar',
                    },
                    {
                        name: 'outline_price',
                        type: 'varchar',
                    },
                    {
                        name: 'character_limit',
                        type: 'varchar',
                    },
                    {
                        name: 'can_have_outline',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'name_outline_material',
                        type: 'text',
                    },
                    {
                        name: 'product_types',
                        type: 'text',
                    },
                    {
                        name: 'patch_price',
                        type: 'varchar',
                    },
                    {
                        name: 'patch_material',
                        type: 'varchar',
                    },
                    {
                        name: 'crystal_price',
                        type: 'varchar',
                    },
                    {
                        name: 'crystal_material',
                        type: 'varchar',
                    },
                    {
                        name: 'optional',
                        type: 'boolean',
                    },
                    {
                        name: 'custom_product_sizing_id',
                        type: 'varchar',
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ]
            })
        );
        // customizer color group table
        await queryRunner.createTable(
            new Table({
                name: CUSTOMIZER_COLOR_GROUP,
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ]
            })
        );
        // customizer color group table
        await queryRunner.createTable(
            new Table({
                name: CUSTOM_COLOR_GROUP,
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'hex_color',
                        type: 'varchar',
                    },
                    {
                        name: 'published',
                        type: 'int',
                    },
                    {
                        name: 'custom_material_id',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ]
            })
        );
        // custom material table
        await queryRunner.createTable(
            new Table({
                name: CUSTOM_MATERIAL,
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'hex_color',
                        type: 'varchar',
                    },
                    {
                        name: 'data_uri',
                        type: 'text',
                    },
                    {
                        name: 'thai_name',
                        type: 'varchar',
                    },
                    {
                        name: 'material_type_id',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'material_groups',
                        type: 'varchar',
                    },
                    {
                        name: 'price',
                        type: 'varchar',
                    },
                    {
                        name: 'published',
                        type: 'int',
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ]
            })
        );
        // material type table
        await queryRunner.createTable(
            new Table({
                name: MATERIAL_TYPE,
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'description',
                        type: 'text',
                    },
                    {
                        name: 'customizer_color_group_id',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ]
            })
        );

        // foriegn key for custom_material_id of CUSTOM_COLOR_GROUP
        await queryRunner.createForeignKey(CUSTOM_COLOR_GROUP,
            new TableForeignKey({
                columnNames: ['custom_material_id'],
                referencedColumnNames: ['id'],
                referencedTableName: CUSTOM_MATERIAL,
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            })
        )
        // foriegn key for material_type_id of CUSTOM_COLOR_GROUP
        await queryRunner.createForeignKey(CUSTOM_MATERIAL,
            new TableForeignKey({
                columnNames: ['material_type_id'],
                referencedColumnNames: ['id'],
                referencedTableName: MATERIAL_TYPE,
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            })
        )
        // foriegn key for customizer_color_group_id of MATERIAL_TYPE
        await queryRunner.createForeignKey(MATERIAL_TYPE,
            new TableForeignKey({
                columnNames: ['customizer_color_group_id'],
                referencedColumnNames: ['id'],
                referencedTableName: CUSTOMIZER_COLOR_GROUP,
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(CUSTOM_COLOR_GROUP, 'FK_custom_color_group_custom_material_id')
        await queryRunner.dropForeignKey(CUSTOM_MATERIAL, 'FK_custom_material_material_type_id')
        await queryRunner.dropForeignKey(MATERIAL_TYPE, 'FK_material_type_customizer_color_group_id')
        await queryRunner.dropTable(CUSTOMIZER_COLOR_GROUP)
        await queryRunner.dropTable(CUSTOM_COLOR_GROUP)
        await queryRunner.dropTable(CUSTOM_MATERIAL)
        await queryRunner.dropTable(CUSTOMIZER_NAME)
        await queryRunner.dropTable(CUSTOMIZER_AREA)
    }

}
