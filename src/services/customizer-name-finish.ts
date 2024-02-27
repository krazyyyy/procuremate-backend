import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomizerNameFinishes } from "../models/customizer-name-finishes";

class CustomizerNameFinishService extends TransactionBaseService {
  private repository: any;
  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(CustomizerNameFinishes);

  }


  async create(obj: CustomizerNameFinishes) {
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomizerNameFinishes>) {
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    const found = await this.repository.findOne({ where: { id } })
    if (!found) {
      throw new Error("Not found exception")
    }
    return found;
  }


  async update(id: string, dto: Partial<CustomizerNameFinishes>) {
    var item = await this.findOne(id);
    if (item) {
      await this.repository.update(item.id, dto);
      return await this.findOne(item.id)
    }
    return false;
  }

  async delete(id: string) {
    return await this.repository.delete({ id })
  }
}

export default CustomizerNameFinishService;