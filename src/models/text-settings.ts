import { BeforeInsert, Column, Entity, } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class TextSettings extends BaseEntity {

  @Column({ type: "text" })
  text: string;

  @Column({ type: "varchar" })
  size: string;

  @Column({ type: "int" })
  price: number;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "text_settings");
  }
}
