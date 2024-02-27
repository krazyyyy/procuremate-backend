import {
    BeforeInsert,
    Column,
    Entity
  } from "typeorm";
  import { BaseEntity } from "@medusajs/medusa";
  import { generateEntityId } from "@medusajs/medusa/dist/utils";

  
  @Entity()
  export class Graphic extends BaseEntity {
  
    @Column({ type: "varchar" })
    name: string;
  
    @Column({ type: "varchar" })
    type: string;
    
    @Column({ type: "varchar" })
    image_url: string;
    

    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "graphic");
    }
  }
  