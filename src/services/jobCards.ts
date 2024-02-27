import { TransactionBaseService } from "@medusajs/medusa";
import { JobCards } from "../models/job-cards";
import { Product } from "@medusajs/medusa/dist";
import { Order } from "@medusajs/medusa/dist";
import { CustomDesign } from "../models/custom-design";
import { Repository, Like, FindOneOptions } from "typeorm";

class JobCardService extends TransactionBaseService {
  private repository: Repository<JobCards>;

  constructor({ manager }) {
    super({ manager });
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(JobCards);
  }

  async findOne(options: FindOneOptions<JobCards>) {
    return this.repository.findOne(options)
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('job_cards')
      .leftJoinAndSelect('job_cards.product_id', 'Product')
      .leftJoinAndSelect('job_cards.order_id', 'Order')
      .leftJoinAndSelect('Order.payments', 'Payments')
      .leftJoinAndSelect('Order.items', 'Items')
      .leftJoinAndSelect('Order.shipping_address', 'Shipping_address')
      .leftJoinAndSelect('Order.fulfillments', 'Fulfillments')
      .leftJoinAndSelect('job_cards.custom_design_id', 'custom_design.id')
      .orderBy('job_cards.created_at', 'DESC'); // Add the default ordering here

    for (const key in queryParams) {
      if (key === 'display_id') {
        if (queryParams.hasOwnProperty(key)) {
          query.andWhere(`${key} = :${key}`, { [key]: queryParams[key] });
        }
      } else if (key === "job_order_id") {
        if (queryParams.hasOwnProperty(key)) {
          query.andWhere(`job_cards.order_id = :${key}`, { [key]: queryParams[key] });
        }
      }
      else if (key === 'order_status') {
        query.andWhere(`"Order".metadata->>'status' LIKE :statusValue`, {
          statusValue: `%${queryParams[key]}%`,
        });
      } else if (key === 'due_date' || key === 'send_date') {
        query.andWhere(`Order.metadata->>'${key}' = :${key}`, {
          [key]: queryParams[key],
        });
      } else {
        query.andWhere(`${key} LIKE :${key}`, {
          [key]: `%${queryParams[key]}%`,
        });
      }
    }

    const totalCount = await query.getCount();
    const job_cards = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getMany();

    return {
      totalCount,
      pageSize,
      pageNumber,
      job_cards: job_cards.map((j) => {
        delete j.custom_design_id?.design_data;
        return j;
      }),
    };
  }

  async fetchCustomDesignById(productId: string): Promise<CustomDesign | null> {
    // Assuming you have a repository for CustomDesign
    const query = this.repository.createQueryBuilder('custom_design')
    const customDesign = await this.manager_.getRepository(CustomDesign).findOne({
      where: { product_id: productId },
    });
    return customDesign || null;

  }


  async create(type: string, comment: string, fight_date: Date, product_id: string, order_id: string, design_data: any, custom_design_id: any) {
    try {
      const product = await this.manager_.getRepository(Product).findOne({
        where: { id: product_id },
      });
      if (!product) {
        return { status: "error", error: `Product with ID ${product_id} not found.` };
      }

      const order = await this.manager_.getRepository(Order).findOne({
        where: { id: order_id },
      });
      if (!order) {
        return { status: "error", error: `Order with ID ${order_id} not found.` };
      }

      const jobCard = this.repository.create({
        type,
        fight_date,
        comment,
        custom_design_id: custom_design_id,
        design_data: design_data,
        product_id: product,
        order_id: order,
      });

      const savedJobCard = await this.repository.save(jobCard);
      return { status: "success", jobCard: savedJobCard };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  async list() {
    try {
      const jobCards = await this.repository.find();
      return { status: "success", data: jobCards };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  async delete(id: any) {
    try {
      await this.repository.delete({ id });
      return { status: "success" };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  async update(id: any, data: Partial<JobCards>) {
    try {
      const entity = await this.repository.findOne({ where: { id } });
      if (!entity) {
        return { status: "error", error: `Job Card with ID ${id} not found.` };
      }

      Object.assign(entity, data);
      const updatedJobCard = await this.repository.save(entity);
      return { status: "success", jobCard: updatedJobCard };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }

  async findById(id: any) {
    try {
      const jobCard = await this.repository.findOne({ where: { id }, relations: ['custom_design_id', 'product_id', 'order_id', 'order_id.payments', 'order_id.billing_address', 'order_id.shipping_address', 'order_id.customer', 'order_id.items'] });
      if (!jobCard) {
        return { status: "error", error: `Job Card with ID ${id} not found.` };
      }

      return { status: "success", job_card: jobCard };
    } catch (error) {
      return { status: "error", error: error.message };
    }
  }
}

export default JobCardService;
