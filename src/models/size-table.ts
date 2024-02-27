import {
  Entity,
  Column,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { CustomProductSizing } from './custom-product-sizing';

@Entity()
export class SizeTable extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string | null;


  @Column({ type: 'varchar' })
  price_adjust: string | null;

  @OneToOne(() => CustomProductSizing, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  custom_product_sizing_id: string;

  @BeforeInsert()
  private beforeInsert() {
    this.id = generateEntityId(this.id, 'size_table')
  }
}