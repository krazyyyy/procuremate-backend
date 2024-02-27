import { Column, Entity } from "typeorm"
import { Customer as MedusaCustomer } from "@medusajs/medusa"

@Entity()
export class Product extends MedusaCustomer {
  @Column({ type: 'varchar' })
  gender: string
}

