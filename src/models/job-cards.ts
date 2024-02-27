import {
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { Order } from "@medusajs/medusa/dist";
import { Product } from '@medusajs/medusa/dist';
import { CustomDesign } from "./custom-design";

@Entity()
export class JobCards extends BaseEntity {

  @Column({ type: "varchar" })
  type: string | null;

  @Column({ type: "varchar" })
  comment: string | null;

  @Column({ type: "date" })
  fight_date: Date | null;

  @OneToOne(() => Product, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product_id: Product;

  @OneToOne(() => Order, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order_id: Order;

  @OneToOne(() => CustomDesign, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "custom_design_id" })
  custom_design_id: CustomDesign;

  @Column({ type: 'varchar' })
  design_data: object | {}

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "job_cards");
  }
}
