import { TransactionBaseService } from "@medusajs/medusa"
import { GraphicSize } from "../models/graphic-size";
import { GraphicMain } from "../models/graphics-main";

class GraphicSizeService extends TransactionBaseService {
  private repository: any;
  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(GraphicSize);
  }


  async create(title: string, description: string, price: string, graphic_id: string) {

    const graphicSize = this.repository.create({ title, description, price, graphic_id: graphic_id });
    return await this.repository.save(graphicSize);
  }
  async list() {
    return await this.repository.find();
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder('graphic_size');
    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
      }
    }
    const totalCount = await query.getCount(); 
    const graphic_size = await query
    .take(pageSize)
    .skip((pageNumber - 1) * pageSize)
    .getMany();  
    return {
      totalCount,
      pageSize,
      pageNumber,
      graphic_size,
    };
  }

  async delete(id: any) {
    return await this.repository.delete({ id })
  }
  async update(id: any, data: Partial<GraphicSize>) {
    const entity = await this.repository.findOne({where : { id : id}});
    if (!entity) {
      throw new Error(`Graphic with ID ${id} not found.`);
    }

    Object.assign(entity, data);
    return await this.repository.save(entity);
  }
}

export default GraphicSizeService;