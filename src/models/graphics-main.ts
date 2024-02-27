import {
    BeforeInsert,
    Column,
    Entity,
    JoinTable,
    ManyToMany
  } from "typeorm";
  import { BaseEntity } from "@medusajs/medusa";
  import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { ProductCategory } from "@medusajs/medusa";
  
  @Entity()
  export class GraphicMain extends BaseEntity {
  
    @Column({ type: "varchar" })
    name: string;
  
    @Column({ type: "varchar" })
    type: string;
    
 
    @ManyToMany(() => ProductCategory, { cascade: ["remove", "soft-remove"] })
    @JoinTable({
      name: "graphic_main_product_category",
      joinColumn: {
        name: "graphic_main_id",
        referencedColumnName: "id",
      },
      inverseJoinColumn: {
        name: "product_category_id",
        referencedColumnName: "id",
      },
    })
    productCategories: ProductCategory[];

    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "graphic_main");
    }
  }
  