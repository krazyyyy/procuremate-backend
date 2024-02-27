import { TransactionBaseService } from "@medusajs/medusa";
import { FindOneOptions, Repository } from "typeorm";
import { SizeGuideKey } from "../models/size-column";


class SizeGuideValueService extends TransactionBaseService {
  private repository: any;
  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(SizeGuideKey);
  }


  async create(obj: any) {

    const graphicSize = this.repository.create(obj);
    return await this.repository.save(graphicSize);
  }
  async list() {
    return await this.repository.find();
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('size_guide_key');
    query.leftJoinAndSelect('size_guide_key.category_id', 'ProductCategory')
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }
    const totalCount = await query.getCount();
    const size_guide = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getMany();
    return {
      totalCount,
      pageSize,
      pageNumber,
      size_guide,
    };
  }

  async get(options: FindOneOptions<SizeGuideKey>) {
    return await this.repository.find(options)
  }


  async delete(id: any) {
    return await this.repository.delete({ id })
  }
  async update(id: any, data: Partial<SizeGuideKey>) {

    const entity = await this.repository.find({ where: { id } });

    Object.assign(entity, data);
    return await this.repository.save(entity);
  }
}

export default SizeGuideValueService;
