import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { Production } from "../models/production";
import { ProductionType } from "../models/production-type";
import { Currency } from "@medusajs/medusa";
class ProductionTypeService extends TransactionBaseService {
  private repository: Repository<ProductionType> | null;
  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(ProductionType);
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder();
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }

    const [production_type, totalCount] = await query
      .orderBy('created_at', 'ASC')
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    return {
      totalCount,
      pageSize,
      pageNumber,
      production_type,
    };
  }



  async create(cs: any) {
    try {
      const production = await this.manager_.getRepository(Production).findOne({ where: { id: cs.production_id } });
  
      cs.production_id = production
    } catch {
      delete cs.production_id
    }
    const item = this.repository.create(cs);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<ProductionType>) {
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find();
  }


  async update(id: string, data: Partial<ProductionType>) {
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

export default ProductionTypeService;