import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomizerNameCrystal } from "../models/customizer-name-crystals";
class CustomizerNameCrystalService extends TransactionBaseService {
  private repository: Repository<CustomizerNameCrystal> | null;
  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(CustomizerNameCrystal);

  }


  async create(obj: CustomizerNameCrystal) {
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomizerNameCrystal>) {
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


  async update(id: string, dto: Partial<CustomizerNameCrystal>) {
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

export default CustomizerNameCrystalService;