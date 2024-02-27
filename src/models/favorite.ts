import {
  BeforeInsert,
  Entity,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { BaseEntity, Customer } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { Product } from "./product";


@Entity()
export class Favorite extends BaseEntity {

  @OneToOne(() => Product, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: 'product_id' })
  product: string;

  @OneToOne(() => Customer, { onDelete: "CASCADE", eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "fav");
  }
}
