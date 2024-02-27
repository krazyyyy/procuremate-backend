import { TransactionBaseService } from "@medusajs/medusa";
import { FindOneOptions, Repository } from "typeorm";
import { CustomSizing } from "../models/custom-sizing";
import { CustomProductSizing } from "../models/custom-product-sizing";
import { ProductCategory } from "@medusajs/medusa";
import { v4 as uuidv4 } from "uuid";

class CustomSizingService extends TransactionBaseService {
  private repository: Repository<CustomSizing> | null;
  constructor({ manager }) {
    super({ manager });
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(CustomSizing);
  }

  async create(cs: any) {
    if (cs.product_categories && cs.product_categories.length > 0) {
      const productCategories = await this.manager_.getRepository(ProductCategory).findByIds(cs.product_categories);
      cs.productCategories = productCategories;
      delete cs.product_categories;
    } else {
      cs.productCategories = [];
    }

    // Generate a unique ID
    const uniqueId = uuidv4();

    return await this.repository.save({
      id: uniqueId, // Assign the generated unique ID
      title: cs.title,
      productCategories: cs.productCategories,
    });
  }

  async get(options: FindOneOptions<CustomSizing>) {
    options.relations = ['productCategories']
    return await this.repository.find(options);
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder("custom_sizings")
    .leftJoinAndSelect('custom_sizings.productCategories', 'ProductCategory')      
  

    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }

    const [custom_product_sizings, totalCount] = await query
    .orderBy('custom_sizings.created_at', 'DESC') 
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    return {
      totalCount,
      pageSize,
      pageNumber,
      custom_product_sizings,
    };
  }

  async list(pageSize: number, pageNumber: number) {
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    return await this.repository.find({
      take,
      skip,
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
    return await this.repository.delete({ id });
  }
}

export default CustomSizingService;
