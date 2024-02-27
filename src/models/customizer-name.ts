import {
  Entity,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { ProductCategory } from '@medusajs/medusa';
import { MaterialType } from './material-type';
import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class CustomizerName extends BaseEntity {

  @Column({ type: 'varchar' })
  title: string | null;

  @Column({ type: 'varchar' })
  description: string | null;


  @Column({ type: 'varchar' })
  internal_description: string | null;

  @Column({ type: 'varchar' })
  base_price: string | null;

  @Column({ type: 'varchar' })
  price: string | null;

  @Column({ type: 'varchar' })
  outline_price: string | null;

  @Column({ type: 'varchar' })
  character_limit: string | null;

  @Column({ type: 'boolean' })
  can_have_outline: boolean = false;

  @Column({ type: 'text' })
  name_outline_material: string | null;
  
  @Column({ type: 'boolean' })
  can_have_crystals: boolean = false;

  @Column({ type: 'boolean' })
  can_have_patch: boolean = false;
  
  @Column({ type: 'boolean' })
  allow_special_finishes: boolean = false;

  @ManyToMany(() => MaterialType, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: "customizer_name_material_type",
    joinColumn: {
      name: "customizer_name_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "material_type_id",
      referencedColumnName: "id",
    },
  })
  name_fill_materials: MaterialType[]


  @ManyToMany(() => ProductCategory, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: "customizer_name_product_category",
    joinColumn: {
      name: "customizer_name_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_category_id",
      referencedColumnName: "id",
    },
  })
  product_types: ProductCategory[];

  @Column({ type: 'varchar' })
  patch_price: string | null;

  @OneToOne(() => MaterialType, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "patch_material" }) // Specify the correct column name here
  patch_material: MaterialType;

  @OneToOne(() => MaterialType, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "crystal_material" }) // Specify the correct column name here
  crystal_material: MaterialType;

  @Column({ type: 'varchar' })
  crystal_price: string | null;

  @Column({ type: 'boolean' })
  optional: boolean;

  @BeforeInsert()
  private beforeInsert() {
    this.id = generateEntityId(this.id, 'customizer_name')
  }
}