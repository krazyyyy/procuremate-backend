import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomMaterial } from "../models/custom-material";
import { CustomColorGroup } from "../models/custom-color-group";

class CustomMaterialSerivce extends TransactionBaseService {
  private repository: Repository<CustomMaterial> | null;
  constructor({ manager, customMaterialRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = customMaterialRepository;
  }


  async create(obj: CustomMaterial) {
    if (obj.customColor && obj.customColor.length > 0) {
      const customColor = await this.manager_.getRepository(CustomColorGroup).findByIds(obj.customColor);
      delete obj.customColor;
      const item = this.repository.create(obj) as CustomMaterial; // Type assertion
      item.customColor = customColor; // Set the customColor property using the set method
      return await this.repository.save(item);
    } else {
      delete obj.customColor;
      obj.customColor = [];
      const item = this.repository.create(obj) as CustomMaterial; // Type assertion
      return await this.repository.save(item);
    }
  }


  async get(options: FindOneOptions<CustomMaterial>) {
    return await this.repository.find({
      ...options,
      join: {
        alias: 'custom_material',
        leftJoinAndSelect: {
          customColor: 'custom_material.customColor',
        },
      },
    });
  }



  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('custom_material');
    query.leftJoinAndSelect('custom_material.customColor', 'custom_color');

    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
        if (key === 'title') {
            if (queryParams.hasOwnProperty(key)) {
              query.andWhere(`custom_material.${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
            }
        } else if (key === 'color_title') {
            if (queryParams.hasOwnProperty(key)) {
              query.andWhere(`custom_color.${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
            }
        } else {
          if (queryParams.hasOwnProperty(key)) {
            query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
          }
      }
    }
    

    const [custom_material, totalCount] = await query
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      totalCount,
      pageSize,
      pageNumber,
      custom_material,
    };
  }


  async list() {
    return await this.repository.find({
      relations: ['customColor']
    });
  }

  async update(id: string, data: any) {
    const item = await this.repository.findOne({ where: { id }, relations: ['customColor'] });
    if (item) {
      if (data.customColor && data.customColor.length > 0) {
        const customColor = await this.manager_.getRepository(CustomColorGroup).findByIds(data.customColor);
        item.customColor = customColor;
      } else {
        item.customColor = []; // Clear the materialTypes relation
      }

      // Delete materialTypes that exist in the database but not in data.material_type
      const customColorTypeIds = item.customColor.map((materialType) => materialType.id);
      const customColorToDelete = item.customColor.filter((materialType) => !customColorTypeIds.includes(materialType.id));
      await this.manager_.getRepository(CustomColorGroup).remove(customColorToDelete);

      delete data.customColor; // Remove customColor property from data

      Object.assign(item, data); // Merge the updated data with the existing item

      await this.repository.save(item);
      return item;
    }

    return false;
  }




  async delete(id: string) {
    return await this.repository.delete({ id })
  }
}

export default CustomMaterialSerivce;