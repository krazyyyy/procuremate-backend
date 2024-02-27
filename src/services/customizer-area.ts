import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomizerArea } from "../models/customizer-area";

class CustomizerAreaSerivce extends TransactionBaseService {
  private repository: Repository<CustomizerArea> | null;
  constructor({ manager, customizerAreaRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = customizerAreaRepository;
  }


  async create(obj: CustomizerArea) {
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomizerArea>) {
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


  async update(id: string, dto: Partial<CustomizerArea>) {
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

export default CustomizerAreaSerivce;