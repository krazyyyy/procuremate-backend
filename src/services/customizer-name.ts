import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomizerName } from "../models/customizer-name";
import { MaterialType } from "../models/material-type";
import { ProductCategory } from "@medusajs/medusa";
class CustomizerNameSerivce extends TransactionBaseService {
  private repository: Repository<CustomizerName> | null;
  constructor({ manager, customizerNameRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = customizerNameRepository;
  }


  async create(obj: any) {
    if (obj.name_fill_materials && obj.name_fill_materials.length > 0) {
      const name_fill_materials = await this.manager_.getRepository(MaterialType).findByIds(obj.name_fill_materials);
      delete obj.name_fill_materials;
      obj.name_fill_materials = name_fill_materials;
    } else {
      delete obj.name_fill_materials;
      obj.name_fill_materials = [];
    }
    if (obj.product_types && obj.product_types.length > 0) {
      const product_types = await this.manager_.getRepository(ProductCategory).findByIds(obj.product_types);
      delete obj.product_types;
      obj.product_types = product_types;
    } else {
      delete obj.product_types;
    }
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomizerName>) {
    options.relations = ['name_fill_materials', 'patch_material', 'crystal_material', 'product_types' ]
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find({
      relations : ['name_fill_materials', 'patch_material', 'crystal_material', 'product_types' ]
    });
  }

  async update(id: string, data: any) {
    const item = await this.repository.findOne({ where: { id }, relations: ['name_fill_materials',  'product_types'] });
    if (item) {
      if (data.name_fill_materials && data.name_fill_materials.length > 0) {
        const name_fill_materials = await this.manager_.getRepository(MaterialType).findByIds(data.name_fill_materials);
        item.name_fill_materials = name_fill_materials;
      } else {
        item.name_fill_materials = []; // Clear the materialTypes relation
      }
  
      // Delete materialTypes that exist in the database but not in data.material_type
      const existingMaterialTypeIds = item.name_fill_materials.map((materialType) => materialType.id);
      const materialTypesToDelete = item.name_fill_materials.filter((materialType) => !existingMaterialTypeIds.includes(materialType.id));
      if (data.product_types && data.product_types.length > 0) {
        const product_types = await this.manager_.getRepository(ProductCategory).findByIds(data.product_types);
        item.product_types = product_types;
      } else {
        item.product_types = []; // Clear the materialTypes relation
      }
  
      // Delete materialTypes that exist in the database but not in data.material_type
      const productCategoriesTypeIds = item.name_fill_materials.map((materialType) => materialType.id);
      const productCategoriesToDelete = item.name_fill_materials.filter((materialType) => !productCategoriesTypeIds.includes(materialType.id));
      await this.manager_.getRepository(MaterialType).remove(productCategoriesToDelete);
  
      delete data.name_fill_materials; // Remove customColor property from data
      delete data.product_types; // Remove customColor property from data
  
      Object.assign(item, data); // Merge the updated data with the existing item
  
      await this.repository.save(item);
      return item;
    }
  
    return false;
  }

  // async update(id: string, dto: any) {
  //   if (dto.name_fill_materials && dto.name_fill_materials.length > 0) {
  //     const name_fill_materials = await this.manager_.getRepository(MaterialType).findByIds(dto.name_fill_materials);
  //     delete dto.name_fill_materials;
  //     dto.name_fill_materials = name_fill_materials;
  //   } else {
  //     delete dto.name_fill_materials;
  //   }
  //   if (dto.product_types && dto.product_types.length > 0) {
  //     const product_types = await this.manager_.getRepository(ProductCategory).findByIds(dto.product_types);
  //     delete dto.product_types;
  //     dto.product_types = product_types;
  //   } else {
  //     delete dto.product_types;
  //   }
  //   const item = await this.repository.findOne({ where: { id } });
  //   if (item) {
  //     await this.repository.update(item.id, dto);
  //     return await this.repository.findOne({ where: { id: item.id } })
  //   }
  //   return false;
  // }


  async delete(id: string) {
    return await this.repository.delete({ id })
  }
}

export default CustomizerNameSerivce;