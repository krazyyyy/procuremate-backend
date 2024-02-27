import {
  Entity,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
} from 'typeorm';

import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { MaterialType } from './material-type';

@Entity()
export class CustomizerColorGroup extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string | null;

  @ManyToMany(() => MaterialType, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: "customizer_color_group_material_type",
    joinColumn: {
      name: "customizer_color_group_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "material_type_id",
      referencedColumnName: "id",
    },
  })
  materialTypes: MaterialType[]

  @BeforeInsert()
  private beforeInsert() {
    this.id = generateEntityId(this.id, 'customizer_color_group')
  }
}