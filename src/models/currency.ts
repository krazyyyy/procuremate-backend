import { Column, Entity } from "typeorm"
import { Currency as MedusaCurrency } from "@medusajs/medusa"

@Entity()
export class Currency extends MedusaCurrency {
  @Column({ type: 'varchar' })
  rate: string | null

}