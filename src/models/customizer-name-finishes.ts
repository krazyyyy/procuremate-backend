import {
  Entity,
  Column,
  BeforeInsert,
} from 'typeorm';

import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class CustomizerNameFinishes extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string | null;

  @Column({ type: 'varchar' })
  price: string | null;

  @Column({ type: 'boolean' })
  is_three_d: boolean;

  @BeforeInsert()
  private beforeInsert() {
    this.id = generateEntityId(this.id, 'customizer_name_finishes')
  }
}