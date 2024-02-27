import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { CustomizerGraphic } from "../models/customizer-graphic";

class CustomizerGraphicService extends TransactionBaseService {
  private repository: Repository<CustomizerGraphic> | null;
  constructor({ manager, customizerGraphicRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = customizerGraphicRepository;
  }


  async create(obj: CustomizerGraphic) {
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<CustomizerGraphic>) {
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find();
  }

  async update(id: string, dto: Partial<CustomizerGraphic>) {
    var item = await this.repository.findOne({ where: { id } });
    if (item) {
      await this.repository.update(item.id, dto);
      return await this.repository.findOne({ where: { id: item.id } })
    }
    return false;
  }

  async delete(id: string) {
    return await this.repository.delete({ id })
  }
}

export default CustomizerGraphicService;