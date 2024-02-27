import {
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { ProductCategory } from "@medusajs/medusa/dist";
import { Product } from '@medusajs/medusa/dist';
import { CustomDesign } from "./custom-design";
@Entity()
export class Gallery extends BaseEntity {

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "varchar" })
  handle: string;

  @Column({ type: "jsonb" })
  images: string[];

  @OneToOne(() => CustomDesign, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "custom_design_id" }) // Specify the correct column name here
  custom_design_id: CustomDesign;

  @OneToOne(() => ProductCategory, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "category_id" }) // Specify the correct column name here
  category_id: ProductCategory;

  @OneToOne(() => Product, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "product_id" }) // Specify the correct column name here
  product_id: Product;


  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "gallery");
  }
}
