import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { CustomSizing } from "./custom-sizing";
@Entity()
export class CustomProductSizing extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  price_adjust: string;

  @OneToOne(() => CustomSizing, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "custom_sizes_id" }) // Specify the correct column name here
  custom_sizes_id: CustomSizing;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'custom_product_sizing')
  }
}