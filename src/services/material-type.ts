import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { MaterialType } from "../models/material-type";

class MaterialTypeService extends TransactionBaseService {
  private repository: Repository<MaterialType> | null;
  constructor({ manager, materialTypeRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = materialTypeRepository;
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('material_type');
  
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }
  
    const totalCount = await query.getCount();
  
    const material_types = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getMany();
  
    return {
      totalCount,
      pageSize,
      pageNumber,
      material_types,
    };
  }


  async create(obj: MaterialType) {
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<MaterialType>) {
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find();
  }

  async update(id: string, dto: Partial<MaterialType>) {
    const item = await this.repository.findOne({ where: { id } });
    if (item) {
      Object.assign(item, dto)
      await this.repository.update(item.id, item);
      return await this.repository.findOne({ where: { id: item.id } })
    }
    return false;
  }


  async delete(id: string) {
    return await this.repository.delete({ id })
  }
}

export default MaterialTypeService;