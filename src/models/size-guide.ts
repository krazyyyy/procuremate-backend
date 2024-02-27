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
import { SizeGuideKey } from "./size-column";
@Entity()
export class SizeGuideValues extends BaseEntity {

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

  @OneToOne(() => SizeGuideKey, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "size_key" }) // Specify the correct column name here
  size_key: SizeGuideKey;


  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "size-guide");
  }
}
