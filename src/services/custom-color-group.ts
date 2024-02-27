import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomColorGroup } from "../models/custom-color-group";

class CustomColorGroupService extends TransactionBaseService {
  private repository: Repository<CustomColorGroup> | null;
  constructor({ manager, customColorGroupRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = customColorGroupRepository;
  }


  async create(obj: CustomColorGroup) {
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomColorGroup>) {
    return await this.repository.findOne(options)
  }

  async update(id: string, data: Partial<CustomColorGroup>) {
    const item = await this.repository.findOne({ where: { id } });
    if (item) {
      await this.repository.update(item.id, data);
      return await this.repository.findOne({ where: { id: item.id } })
    }
    return false;
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('custom_color_group');
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }
    const totalCount = await query.getCount();
    const custom_color_group = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getMany();
    return {
      totalCount,
      pageSize,
      pageNumber,
      custom_color_group,
    };
  }

  async list() {
    return await this.repository.find();
  }

  async delete(id: string) {
    return await this.repository.delete({ id })
  }
}

export default CustomColorGroupService;