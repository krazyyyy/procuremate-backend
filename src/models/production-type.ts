import {
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { Production } from "./production";

@Entity()
export class ProductionType extends BaseEntity {

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  description: string | null;

  @Column({ type: "varchar" })
  price: string | null;

  @Column({ type: "varchar" })
  days: string | null;

  @Column({ type: "varchar" })
  email_title: string | null;

  @Column({ type: "boolean" })
  express_shipping: boolean | false;

  @OneToOne(() => Production, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "production_id" }) // Specify the correct column name here
  production_id: Production;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "production_type");
  }
}
