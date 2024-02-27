import {
  Entity,
  Column,
  BeforeInsert,
} from 'typeorm';

import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class CustomizerArea extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string | null;


  @Column({ type: 'varchar' })
  price_adjust: string | null;

  @Column({ type: 'boolean' })
  optional: boolean;

  @BeforeInsert()
  private beforeInsert() {
    this.id = generateEntityId(this.id, 'customizer_area')
  }
}