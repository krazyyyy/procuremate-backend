import { Column, Entity } from "typeorm"
import { Product as MedusaProduct } from "@medusajs/medusa"

@Entity()
export class Product extends MedusaProduct {
  @Column({ type: 'boolean' })
  published: boolean

  @Column({ type: 'varchar' })
  seo_title: string

  @Column({ type: 'varchar' })
  page_title: string

  @Column({ type: 'varchar' })
  canonical_url: string

  @Column({ type: 'text' })
  seo_description: string

  @Column({ type: 'text' })
  main_image: string

  @Column({ type: 'varchar' })
  comment: string

}