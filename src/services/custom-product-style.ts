import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomProductStyle } from "../models/custom-product-style";
import { ProductCategory } from "@medusajs/medusa";
import { v4 as uuidv4 } from "uuid";

class CustomProductStyleService extends TransactionBaseService {
  private repository: Repository<CustomProductStyle> | null;
  constructor({ manager, customProductStyleRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = customProductStyleRepository;
  }


  async create(cs: any) {
    if (cs.product_categories && cs.product_categories.length > 0) {
      const productCategories = await this.manager_.getRepository(ProductCategory).findByIds(cs.product_categories);
      cs.productCategories = productCategories;
      delete cs.product_categories;
    } else {
      cs.productCategories = [];
    }

    const uniqueId = uuidv4();
    return await this.repository.save({
      id: uniqueId, // Assign the generated unique ID
      type: cs.type, 
      description: cs.description, 
      title: cs.title,
      productCategories: cs.productCategories,
    });
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('custom_product_style')
    .leftJoinAndSelect('custom_product_style.productCategories', 'ProductCategory')      
  
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }
  
    const totalCount = await query.getCount();
  
    const custom_style = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getMany();
  
    return {
      totalCount,
      pageSize,
      pageNumber,
      custom_style,
    };
  }

  async get(options: FindOneOptions<CustomProductStyle>) {
    options.relations = ['productCategories']
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find({
      relations: ['productCategories']
    });
  }

  async update(id: string, data: any) {
    const item = await this.repository.findOne({ where: { id }, relations: ['productCategories'] });
    if (item) {
      if (data.product_categories && data.product_categories.length > 0) {
        const productCategories = await this.manager_.getRepository(ProductCategory).findByIds(data.product_categories);
        item.productCategories = productCategories;
      } else {
        item.productCategories = []; // Clear the materialTypes relation
      }
  
      // Delete materialTypes that exist in the database but not in data.material_type
      const productCategoriesTypeIds = item.productCategories.map((materialType) => materialType.id);
      const productCategoriesToDelete = item.productCategories.filter((materialType) => !productCategoriesTypeIds.includes(materialType.id));
      await this.manager_.getRepository(ProductCategory).remove(productCategoriesToDelete);
  
      delete data.product_categories; // Remove customColor property from data
  
      Object.assign(item, data); // Merge the updated data with the existing item
  
      await this.repository.save(item);
      return item;
    }
  
    return false;
  }

  async delete(id: any) {
    return await this.repository.delete({ id })
  }
}

export default CustomProductStyleService;