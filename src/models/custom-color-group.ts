import {
  Entity,
  Column,
  BeforeInsert,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { CustomProductSizing } from './custom-product-sizing';

@Entity()
export class CustomColorGroup extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string | null;

  @Column({ type: 'varchar' })
  hex_color: string | null;

  @Column({ type: "varchar" })
  image_url: string;

  @Column({ type: 'boolean' })
  published: boolean=false;

  @BeforeInsert()
  private beforeInsert() {
    this.id = generateEntityId(this.id, 'custom_color_group')
  }
}