import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomizerColorGroup } from "../models/customizer-color-group";
import { MaterialType } from "../models/material-type";

class CustomizerColorGroupSerivce extends TransactionBaseService {
  private repository: Repository<CustomizerColorGroup> | null;
  constructor({ manager, customizerColorGroupRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = customizerColorGroupRepository;
  }


  async create(obj: any) {
    if (obj.material_type && obj.material_type.length > 0) {
      const materialType = await this.manager_.getRepository(MaterialType).findByIds(obj.material_type);
      obj.materialTypes = materialType;
      delete obj.material_type;
    } else {
      delete obj.material_type;
      obj.materialTypes = [];
    }
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }



  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('customizer_color_group')
    .leftJoinAndSelect('customizer_color_group.materialTypes', 'materialTypes');

    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }
  
    const [custom_color_group, totalCount] = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
  
    return {
      totalCount,
      pageSize,
      pageNumber,
      custom_color_group,
    };
  }
  
  

  async get(options: FindOneOptions<CustomizerColorGroup>) {
    options.relations = ['materialTypes'];
    return await this.repository.find(options);
  }

  async update(id: string, data: any) {
    const item = await this.repository.findOne({ where: { id }, relations: ['materialTypes'] });
    if (item) {
      if (data.material_type && data.material_type.length > 0) {
        const materialTypes = await this.manager_.getRepository(MaterialType).findByIds(data.material_type);
        item.materialTypes = materialTypes;
      } else {
        item.materialTypes = []; // Clear the materialTypes relation
      }
  
      // Delete materialTypes that exist in the database but not in data.material_type
      const existingMaterialTypeIds = item.materialTypes.map((materialType) => materialType.id);
      const materialTypesToDelete = item.materialTypes.filter((materialType) => !existingMaterialTypeIds.includes(materialType.id));
      await this.manager_.getRepository(MaterialType).remove(materialTypesToDelete);
  
      delete data.material_type; // Remove customColor property from data
  
      Object.assign(item, data); // Merge the updated data with the existing item
  
      await this.repository.save(item);
      return item;
    }
  
    return false;
  }
  


  async list() {
    return await this.repository.find({
      relations: ['materialTypes']
    });
  }

  async delete(id: string) {
    return await this.repository.delete({ id })
  }
}

export default CustomizerColorGroupSerivce;