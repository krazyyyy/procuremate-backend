import {
  Entity,
  Column,
  BeforeInsert,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';

import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { MaterialType } from './material-type';
import { CustomColorGroup } from './custom-color-group';

@Entity()
export class CustomMaterial extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  thai_name: string | null;

  @Column({ type: 'varchar' })
  hex_color: string | null;

  @Column({ type: 'text' })
  data_uri: string | null;

  @Column({ type: 'varchar' })
  material_type: string | null;

  @Column({ type: 'varchar' })
  price: string | null;

  @Column({ type: 'varchar' })
  published: boolean = false;


  @ManyToMany(() => CustomColorGroup, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: "custom_material_custom_color_group",
    joinColumn: {
      name: "custom_material_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "custom_color_group_id",
      referencedColumnName: "id",
    },
  })
  customColor: CustomColorGroup[];

  @Column({ type: 'varchar' })
  image_url: string | null;

  @BeforeInsert()
  private beforeInsert() {
    this.id = generateEntityId(this.id, 'custom_material')
  }
}