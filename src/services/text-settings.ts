import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { TextSettings } from "../models/text-settings";

class TextSettingsService extends TransactionBaseService {
  private repository: Repository<TextSettings> | null;
  constructor({ manager, textSettingsRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = textSettingsRepository;
  }


  async create(obj: TextSettings) {
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<TextSettings>) {
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    const found = this.repository.findOne({ where: { id } })
    if (!found) {
      throw new Error("Not found exception")
    }
    return found;
  }


  async update(id: string, dto: any) {
    var item = await this.findOne(id);
    if (item) {
      return await this.repository.save({ id, ...dto });
    }
    return false;
  }

  async delete(id: string) {
    return await this.repository.delete({ id })
  }
}

export default TextSettingsService;