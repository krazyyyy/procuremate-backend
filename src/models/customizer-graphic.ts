import {
  Entity,
  Column,
  BeforeInsert,
} from 'typeorm';

import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class CustomizerGraphic extends BaseEntity {

  @Column({ type: 'varchar' })
  flag_price: string;


  @Column({ type: 'varchar' })
  graphic_price: string;

  @Column({ type: 'varchar' })
  upload_price: string;

  @Column({ type: 'varchar' })
  muay_thai: string;

  @Column({ type: 'varchar' })
  remove_boxer_logo: string;


  @BeforeInsert()
  private beforeInsert() {
    this.id = generateEntityId(this.id, 'customizer_graphic')
  }
}