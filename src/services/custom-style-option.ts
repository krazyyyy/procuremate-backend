import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository, Like } from "typeorm";
import { CustomProductStyle } from "../models/custom-product-style";
import { CustomStyleOption } from "../models/custom-style-option";
import { Product } from "@medusajs/medusa";
class CustomStyleOptionsService extends TransactionBaseService {
  private repository: any;
  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(CustomStyleOption);
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('custom_style_options');
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }
    const totalCount = await query.getCount(); 
    const custom_style_option = await query
    .take(pageSize)
    .skip((pageNumber - 1) * pageSize)
    .getMany();  
    return {
      totalCount,
      pageSize,
      pageNumber,
      custom_style_option,
    };
  }

  async create(title : string, subtitle: string, price: string, image_url: string, custom_style_id: string) {
    const style = await this.manager_.getRepository(CustomProductStyle).findOne({ where: { id: custom_style_id } });

    const item = this.repository.create({
      title : title,
      subtitle : subtitle,
      image_url : image_url,
      price : price,
      custom_style_id : style
    });
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomStyleOption>) {
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find();
  }

  // async list(pageSize: number, pageNumber: number) {
  //   const skip = (pageNumber - 1) * pageSize;
  //   const take = pageSize;
  
  //   return await this.repository.find({
  //     take,
  //     skip,
  //   });
  // }
  

  async update(id: string, data: Partial<CustomStyleOptions>) {
    const item = await this.repository.findOne({ where: { id } });
    if (item) {
      Object.assign(item, data)
      return await this.repository.save(item);
    }
    return false;
  }


  async delete(id: any) {
    return await this.repository.delete({ id })
  }
}

export default CustomStyleOptionsService;