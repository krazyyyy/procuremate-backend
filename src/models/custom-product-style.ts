import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { ProductCategory } from "@medusajs/medusa";
@Entity()
export class CustomProductStyle extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => ProductCategory, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: "custom_product_style_product_category",
    joinColumn: {
      name: "custom_product_style_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_category_id",
      referencedColumnName: "id",
    },
  })
  productCategories: ProductCategory[];

  @Column({ type: 'varchar' })
  type: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'custom_product_style')
  }
}