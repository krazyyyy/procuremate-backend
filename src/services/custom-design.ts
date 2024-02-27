import { TransactionBaseService } from "@medusajs/medusa";
import { FindOneOptions, Repository } from "typeorm";
import { CustomDesign } from "../models/custom-design";
import { JobCards } from "../models/job-cards";
import fs from 'fs'


class CustomDesignService extends TransactionBaseService {
  private repository: Repository<CustomDesign> | null;
  private jobCardRepository: Repository<JobCards> | null;
  constructor({ manager, customDesignRepository }) {
    super({ manager });
    this.manager_ = manager;
    this.repository = customDesignRepository;
  }

  async create(cs: Partial<CustomDesign>) {
    var item = this.repository.create(cs);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomDesign>) {
    return await this.repository.find(options);
  }
  
  async getIdAndProductId(productId: string) {
    const customDesigns = await this.repository
      .createQueryBuilder('custom_design')
      .leftJoinAndSelect('custom_design.product_id', 'product')
      .where('product.id = :productId', { productId })
      .getMany();
  
    const matchedDesigns = customDesigns.filter((design) => design.product_id?.id === productId) as [];
  
    // Create an array of promises to fetch order_ids for each matched design
    const orderPromises = matchedDesigns.map(async (design) => {
      const customDesignId = design?.id;
      const response = await this.manager_.getRepository(JobCards).createQueryBuilder("job_cards")
        .leftJoinAndSelect('job_cards.custom_design_id', 'custom_design')
        .leftJoinAndSelect('job_cards.order_id', 'Order')
        .where('custom_design.id = :customDesignId', { customDesignId })
        .getMany();
      design.order_id = String(response[0]?.order_id?.id);
    });
  
    // Wait for all promises to complete
    await Promise.all(orderPromises);
  
    const idAndProductIdArray = matchedDesigns.map(({ id, design_data, product_id, order_id }) => ({
      id,
      svg: design_data?.svg || null,
      product_name: product_id?.title || null,
      product_id: product_id?.id || null,
      order_id: order_id || null,
      design_name: design_data?.title || null
    }));
  
    return idAndProductIdArray;
  }

  async searchIdAndProductId(productId: string, orderId : string | null, design_name : string | null) {
    const customDesigns = await this.repository
      .createQueryBuilder('custom_design')
      .leftJoinAndSelect('custom_design.product_id', 'product')
      .where('product.id = :productId', { productId })
      .getMany();
  
    const matchedDesigns = customDesigns.filter((design) => design.product_id?.id === productId) as [];
  
    // Create an array of promises to fetch order_ids for each matched design
    const orderPromises = matchedDesigns.map(async (design) => {
      const customDesignId = design?.id;
      const response = await this.manager_.getRepository(JobCards).createQueryBuilder("job_cards")
      .leftJoinAndSelect('job_cards.custom_design_id', 'custom_design')
      .leftJoinAndSelect('job_cards.order_id', 'Order')
      .where('Order.id LIKE :orderId', { orderId: `%${orderId}%` })
      .andWhere('custom_design.id = :customDesignId', { customDesignId })
      .getMany();    
    
        // .where('custom_design.id = :customDesignId', { customDesignId })
      design.order_id = String(response[0]?.order_id?.id);
    });
    // Wait for all promises to complete
    await Promise.all(orderPromises);
    
    const idAndProductIdArray = matchedDesigns
    .filter(({ order_id, design_data }) =>
      order_id.includes(orderId) || design_data?.title.toLowerCase().includes(design_name)
    )
    .map(({ id, design_data, product_id, order_id }) => ({
      id,
      svg: design_data?.svg || null,
      product_name: product_id?.title || null,
      product_id: product_id?.id || null,
      order_id: order_id || null,
      design_name: design_data?.title || null,
    }));
  
    return idAndProductIdArray;
  }
  
  
  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder("custom_design")
      .leftJoinAndSelect('custom_design.product_id', 'Product')
      .leftJoinAndSelect('custom_design.customer_id', 'Customer')


    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }

    const [custom_design, totalCount] = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    return {
      totalCount,
      pageSize,
      pageNumber,
      custom_design,
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
    const item = await this.repository.findOne({ where: { id } });
    if (item) {

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

export default CustomDesignService;