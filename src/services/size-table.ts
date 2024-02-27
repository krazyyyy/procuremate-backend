import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { SizeTable } from "../models/size-table";

class SizeTableService extends TransactionBaseService {
  private repository: Repository<SizeTable> | null;
  constructor({ manager, sizeTableRepository }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = sizeTableRepository;
  }

  async create(obj: any) {
    const item = this.repository.create(obj);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<SizeTable>) {
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find();
  }

  async delete(id: any) {
    return await this.repository.delete({ id })
  }
}

export default SizeTableService;