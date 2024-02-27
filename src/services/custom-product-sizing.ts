import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomProductSizing } from "../models/custom-product-sizing";
import { CustomSizing } from "../models/custom-sizing";

class CustomProductSizingService extends TransactionBaseService {
  private repository: Repository<CustomProductSizing> | null;
  constructor({ manager, customProductSizingRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = customProductSizingRepository;
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder();
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }

    const [custom_product_sizings, totalCount] = await query
    .orderBy('created_at', 'ASC') 
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



  async create(cs: any) {
    try {
      const size = await this.manager_.getRepository(CustomSizing).findOne({ where: { id: cs.custom_sizes_id } });
      delete cs.custom_sizes_id
      cs.custom_sizes_id = size
    } catch {
      delete cs.custom_sizesId
    }
    const item = this.repository.create(cs);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomProductSizing>) {
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


  async update(id: string, data: Partial<CustomProductSizing>) {
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

export default CustomProductSizingService;