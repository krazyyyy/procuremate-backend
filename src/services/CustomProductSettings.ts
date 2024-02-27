import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository, Like, FindManyOptions } from "typeorm";
import { CustomProductSettings } from "../models/custom-product-settings";
import { Product } from "@medusajs/medusa";
import { CustomizerArea } from "../models/customizer-area";
class CustomProductSettingsService extends TransactionBaseService {
  private repository: Repository<CustomProductSettings>;
  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(CustomProductSettings);
  }

  async searchOne(queryParams) {
    const query = this.repository.createQueryBuilder('custom_product_settings')
      .leftJoinAndSelect('custom_product_settings.customizer_area_id', 'customizer_area')
      .leftJoinAndSelect('custom_product_settings.material_group', 'customizer_color_group')
      .orderBy('custom_product_settings.rank', 'ASC');
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }

    const layers = await query.getMany();

    return {
      layers,
    };
  }
  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('custom_product_settings')
      .leftJoinAndSelect('custom_product_settings.customizer_area_id', 'customizer_area')
      .leftJoinAndSelect('custom_product_settings.material_group', 'customizer_color_group')
      .orderBy('custom_product_settings.rank', 'ASC');
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }

    const totalCount = await query.getCount();

    const custom_product_settings = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getMany();

    return {
      totalCount,
      pageSize,
      pageNumber,
      custom_product_settings,
    };
  }


  async create(name: string, thai_name: string, material_group: string, preset_material: string, muay_thai: boolean, product_id: string, name_id: string, customizer_area_id: string, rank: string) {
    const product = await this.manager_.getRepository(Product).findOne({ where: { id: product_id } });

    const obj = {
      name: name,
      thai_name: thai_name,
      material_group: material_group,
      preset_material: preset_material,
      muay_thai: muay_thai,
      product_id: product,
      name_id: name_id,
      customizer_area_id: {}
    }
    if (rank !== "") {
      obj.rank = parseInt(rank)
    }
    try {
      const area = await this.manager_.getRepository(CustomizerArea).findOne({ where: { id: customizer_area_id } });
      obj.customizer_area_id = area
    }
    catch {
      delete obj.customizer_area_id
    }

    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomProductSettings>) {
    return await this.repository.findOne(options)
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


  async update(id: string, data: any) {
    if (data.rank !== "") {
      data.rank = parseInt(data.rank)
    } else {
      delete data.rank
    }
    if (data.customizer_area_id && data.customizer_area_id !== "") {
      const area = await this.manager_.getRepository(CustomizerArea).findOne({ where: { id: data.customizer_area_id } });
      data.customizer_area_id = area
    } else {
      delete data.customizer_area_id
    }

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

export default CustomProductSettingsService;