import {
  Entity,
  Column,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { CustomizerColorGroup } from './customizer-color-group';

@Entity()
export class MaterialType extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string | null;

  @BeforeInsert()
  private beforeInsert() {
    this.id = generateEntityId(this.id, 'material_type')
  }
}