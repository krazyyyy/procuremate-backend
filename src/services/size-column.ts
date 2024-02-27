import { TransactionBaseService } from "@medusajs/medusa";
import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import { SizeGuideValues } from "../models/size-guide";;

class SizeColumnValuesService extends TransactionBaseService {
  private repository: Repository<SizeGuideValues>;

  constructor({ manager }) {
    super({ manager });
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(SizeGuideValues);
  }

  async create(data: DeepPartial<SizeGuideValues>) {

    const sizeGuideKey = this.repository.create(data);
    const savedSizeGuideValues = await this.repository.save(sizeGuideKey);
    return { status: "success", data: savedSizeGuideValues };
  }

  async list() {
    try {
      const sizeKeys = await this.repository.find();
      return { status: "success", data: sizeKeys };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('size_guide_value');
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }
    const totalCount = await query.getCount();
    const size_value = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getMany();
    return {
      totalCount,
      pageSize,
      pageNumber,
      size_value,
    };
  }

  async delete(id) {
    try {
      await this.repository.delete({ id });
      return { status: "success" };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  async update(id: any, data: Partial<SizeGuideValues>) {
    const entity = await this.repository.find({ where: { id } });
    if (!entity) {
      return { status: "error", error: `Size guide key with ID ${id} not found.` };
    }


    Object.assign(entity, data);
    const updatedSizeGuideValues = await this.repository.save(entity);
    return { status: "success", sizeColumn: updatedSizeGuideValues };
  }

  async get(options: FindOneOptions<SizeGuideValues>) {
    return await this.repository.find(options)
  }

  async findById(id) {
    try {
      const sizeKeys = await this.repository.findOne({ where: { id } });
      if (!sizeKeys) {
        return { status: "error", error: `Job Card with ID ${id} not found.` };
      }

      return { status: "success", data: sizeKeys };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }
}

export default SizeColumnValuesService;