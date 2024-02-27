import {
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
} from "typeorm"
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { ProductCategory } from "@medusajs/medusa/dist";

@Entity()
export class SizeGuideKey extends BaseEntity {

  @Column({ type: "varchar" })
  column_one: string;

  @Column({ type: "varchar" })
  column_two: string;

  @Column({ type: "varchar" })
  column_three: string;

  @Column({ type: "varchar" })
  column_four: string;

  @Column({ type: "varchar" })
  type: string;

  @OneToOne(() => ProductCategory, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "category_id" }) // Specify the correct column name here
  category_id: ProductCategory;


  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "size_guide_key");
  }
}
