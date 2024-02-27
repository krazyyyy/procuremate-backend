import { generateEntityId, BaseEntity, } from "@medusajs/medusa"
import {
  BeforeInsert, Column, Entity,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { CustomProduct } from "./custom-product"
import { CustomizerArea } from "./customizer-area"
import { Product } from "@medusajs/medusa"
import { CustomizerColorGroup } from "./customizer-color-group"

@Entity()
export class CustomProductSettings extends BaseEntity {
  @Column({ type: 'varchar' })
  name_id: string
  
  @Column({ type: 'varchar' })
  name: string
  
  @Column({ type: 'int' })
  rank: number

  @Column({ type: 'varchar' })
  thai_name: string | null

  @OneToOne(() => CustomizerColorGroup, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'material_group' })
  material_group: string | null

  @Column({ type: 'boolean' })
  muay_thai: boolean | false

  @Column({ type: 'varchar' })
  preset_material: string | null

  @OneToOne(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product_id: string | null

  @OneToOne(() => CustomizerArea, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'customizer_area_id' })
  customizer_area_id: string | null


  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "custom_product_settings")
  }

}