import { generateEntityId, BaseEntity } from "@medusajs/medusa"
import {
  BeforeInsert, Column, Entity,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { Customer } from "@medusajs/medusa"
import { Product } from "@medusajs/medusa"


@Entity()
export class CustomDesign extends BaseEntity {
  @Column({ type: 'varchar' })
  template_url: string | null

  @Column({ type: 'varchar' })
  design_data: object | {}

  @OneToOne(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product_id: string | null

  @OneToOne(() => Customer, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer_id: string | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "custom_design")
  }

}