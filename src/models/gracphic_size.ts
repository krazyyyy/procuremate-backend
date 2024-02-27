import {
    BeforeInsert,
    Column,
    Entity,
    OneToOne,
    JoinColumn,
  } from "typeorm";
  import { BaseEntity } from "@medusajs/medusa";
  import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { Graphic } from "./graphics";
  
  @Entity()
  export class GraphicSize extends BaseEntity {
  
    @Column({ type: "varchar" })
    title: string | null;
  
    @Column({ type: "text" })
    description: string;
  
    @Column({ type: "varchar" })
    price: string | null;
    
    @OneToOne(() => Graphic, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "graphic_id" }) // Specify the correct column name here
    graphic_id: Graphic;

    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "graphicsize");
    }
  }
  