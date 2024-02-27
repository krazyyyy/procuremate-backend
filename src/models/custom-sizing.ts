import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { CustomProductSizing } from "./custom-product-sizing";
import { ProductCategory } from "@medusajs/medusa";

@Entity()
export class CustomSizing extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string;

  @ManyToMany(() => ProductCategory, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: "custom_sizing_product_category",
    joinColumn: {
      name: "custom_sizing_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_category_id",
      referencedColumnName: "id",
    },
  })
  productCategories: ProductCategory[];


  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'custom_sizing')
  }
}