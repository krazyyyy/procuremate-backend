import { TransactionBaseService } from "@medusajs/medusa"
import { FindOneOptions, Repository } from "typeorm";
import { JobCardsComment } from "../models/job-card-comments";
import { JobCards } from "../models/job-cards";

class JobCardCommentsService extends TransactionBaseService {
  private repository: Repository<JobCardsComment> | null;
  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(JobCardsComment);
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder();
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }

    const [job_card_comment, totalCount] = await query
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();

    return {
      totalCount,
      pageSize,
      pageNumber,
      job_card_comment,
    };
  }



  async create(cs: any) {
    try {
      const job_card = await this.manager_.getRepository(JobCards).findOne({ where: { id: cs.job_card_id } });
  
      cs.job_card_id = job_card
    } catch {
      delete cs.job_card_id
    }
    const item = this.repository.create(cs);
    return await this.repository.save(item);
  }

  async get(options: FindOneOptions<JobCardsComment>) {
    return await this.repository.find(options)
  }

  async list() {
    return await this.repository.find();
  }


  async update(id: string, data: Partial<JobCardsComment>) {
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

export default JobCardCommentsService;