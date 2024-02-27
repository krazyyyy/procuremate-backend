import {
    BeforeInsert,
    Column,
    Entity,
    OneToOne,
    JoinColumn
  } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { JobCards } from "./job-cards";

@Entity()
export class JobCardsComment extends BaseEntity {
    @Column({ type: "varchar" })
    comment: string;
  
    @OneToOne(() => JobCards, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn({ name: "job_card_id" }) 
    job_card_id: JobCards;
 
    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "job_card_comment");
    }

}