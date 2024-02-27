import { TransactionBaseService } from "@medusajs/medusa"



import { Graphic } from "../models/graphics";


class GraphicService extends TransactionBaseService {
  private repository: any;
  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(Graphic);
  }


  async create(name: string, type : string, image_url: string) {
    const post = this.repository.create({ name, type, image_url });
    return await this.repository.save(post);
  }

  async list() {
    return await this.repository.find();
  }


  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('graphics');
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }
    const totalCount = await query.getCount(); 
    const graphics = await query
    .take(pageSize)
    .skip((pageNumber - 1) * pageSize)
    .getMany();  
    return {
      totalCount,
      pageSize,
      pageNumber,
      graphics,
    };
  }
  

  async delete(id: any) {
    return await this.repository.delete({ id })
  }
  async update(id: any, data: Partial<Graphic>) {
    const entity = await this.repository.findOne({where : { id : id}});
    if (!entity) {
      throw new Error(`Graphic with ID ${id} not found.`);
    }

    Object.assign(entity, data);
    return await this.repository.save(entity);
  }
  async findById(id: any) {
    return await this.repository.findOne({ where : { id : id}});
  }
}

export default GraphicService;
// graphics_01H127Z8MNH5KB3ZMPEEQA9S0W
