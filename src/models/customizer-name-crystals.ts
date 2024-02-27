import {
  Entity,
  Column,
  BeforeInsert,
} from 'typeorm';

import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class CustomizerNameCrystal extends BaseEntity {

  @Column({ type: 'varchar' })
  description: string | null;

  @Column({ type: 'varchar' })
  price: string | null;

  @Column({ type: 'varchar' })
  material_type: string | null;

  @BeforeInsert()
  private beforeInsert() {
    this.id = generateEntityId(this.id, 'customizer_name_crystal')
  }
}