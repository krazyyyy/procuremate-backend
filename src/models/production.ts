import {
    BeforeInsert,
    Column,
    Entity,
  } from "typeorm";
  import { BaseEntity } from "@medusajs/medusa";
  import { generateEntityId } from "@medusajs/medusa/dist/utils";

  
  @Entity()
  export class Production extends BaseEntity {
  
    @Column({ type: "varchar" })
    production_info: string;
  
    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "production");
    }
  }
  