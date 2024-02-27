import { generateEntityId, BaseEntity, } from "@medusajs/medusa"
import {
  BeforeInsert, Column, Entity,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { Product } from "./product"

@Entity()
export class CustomProduct extends BaseEntity {
  @Column({ type: 'varchar' })
  code: string

  @Column({ type: 'int' })
  sale_amount: number

  @Column({ type: 'date' })
  sale_start_date: Date

  @Column({ type: 'date' })
  sale_end_date: Date

  @OneToOne(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product_id: string

  @Column({ type: 'varchar' })
  template_image: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "custom_product")
  }

}