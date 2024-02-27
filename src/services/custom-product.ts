import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomProduct } from "../models/custom-product";
import { Product } from "@medusajs/medusa"
import { Console } from "console";
class CustomProductService extends TransactionBaseService {
  private repository: Repository<CustomProduct> | null;
  constructor({ manager, customProductRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = customProductRepository;
  }


  async create(obj: any) {
    if (obj.product_id){
      const product = await this.manager_.getRepository(Product).findOne({ where: { id: obj.product_id } });
      delete obj.product_id
      obj.product_id = product
    }
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomProduct>) {
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find({
      relations: ['product_id'] 
    });
  }
  
  async update(id: string, data: Partial<CustomProduct>) {
    const item = await this.repository.findOne({ where: { id }, relations: ['product_id']  });
    if (item) {
      await this.repository.update(item.id, data);
      return await this.repository.findOne({ where: { id: item.id } })
    }
    return false;
  }

  async delete(id: any) {
    return await this.repository.delete({ id })
  }
}

export default CustomProductService;