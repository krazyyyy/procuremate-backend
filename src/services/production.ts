import { TransactionBaseService } from "@medusajs/medusa";
import { FindOneOptions, Repository } from "typeorm";
import { Production } from "../models/production";

class ProductionService extends TransactionBaseService {
  private repository: Repository<Production> | null;
  constructor({ manager }) {
    super({ manager });
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(Production);
  }

  async create(cs: any) {
    const item = this.repository.create(cs);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<Production>) {
    return await this.repository.find(options);
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder("production")    
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }

    const [production, totalCount] = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    return {
      totalCount,
      pageSize,
      pageNumber,
      production,
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
    const item = await this.repository.findOne({ where: { id }});
    if (item) {
      Object.assign(item, data); 

      await this.repository.save(item);
      return item;
    }
  
    return false;
  }

  async delete(id: any) {
    return await this.repository.delete({ id });
  }
}

export default ProductionService;
