import {
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { CustomProductStyle } from "./custom-product-style";

@Entity()
export class CustomStyleOption extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string | null;

  @Column({ type: 'varchar' })
  subtitle: string | null;
  
  @Column({ type: 'varchar' })
  image_url: string | null;
  
  @Column({ type: 'varchar' })
  price: string | null;

  @OneToOne(() => CustomProductStyle, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "custom_style_id" }) // Specify the correct column name here
  custom_style_id: CustomProductStyle | null;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'custom_style_option')
  }
}