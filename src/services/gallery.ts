import { TransactionBaseService } from "@medusajs/medusa"

import { Gallery } from "../models/gallery";
import { Repository } from "typeorm";


class GalleryService extends TransactionBaseService {
  private repository: Repository<Gallery>;
  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(Gallery);
  }


  async create(obj: any) {
    const post = this.repository.create(obj);
    return await this.repository.save(post);
  }

  async list() {
    return await this.repository.find();
  }

  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.repository.createQueryBuilder("gallery")
      .leftJoinAndSelect('gallery.category_id', 'ProductCategory')
      .leftJoinAndSelect('gallery.product_id', 'Product')


    // Iterate over the query parameters and add conditions to the query dynamically
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        if (key === 'category_id') {
          var searchQuery = queryParams[key]
          if (searchQuery.length > 1) {
            query.andWhere(`ProductCategory.id IN (:...searchQuery)`, { searchQuery });
          } else {
            query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
          }
        } else {
          query.andWhere(`${key} LIKE :${key}`, { [key]: `%${queryParams[key]}%` });
        }
      }
    }

    const [gallery, totalCount] = await query
      .orderBy('gallery.created_at', 'DESC') 
      .take(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .getManyAndCount();
    for (var i in gallery) {
      var gal = gallery[i];
      gal.handle = (gal.category_id?.handle ?? '') + '/' + gal.handle;
    }
    return {
      totalCount,
      pageSize,
      pageNumber,
      gallery,
    };
  }


  async findOne(handle: string) {
    const found = this.repository.findOne({ where: { handle }, relations: ['product_id', 'category_id', 'custom_design_id'] },)
    if (!found) {
      throw new Error("Not found exception")
    }
    return found;
  }


  async update(id: string, dto: Partial<Gallery>) {
    const item = await this.repository.findOne({ where: { handle: id } });
    if (item) {
      Object.assign(item, dto)
      return await this.repository.save(item);
    }
    return false;
  }


  async delete(id: any) {
    return await this.repository.delete({ id })
  }
}

export default GalleryService;