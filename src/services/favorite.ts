import { TransactionBaseService } from "@medusajs/medusa"
import { DeepPartial, Repository } from "typeorm";
import { Favorite } from "../models/favorite";


class FavoriteService extends TransactionBaseService {
  private repository: Repository<Favorite>;
  constructor({ manager, favoriteRepository }) {
    super({ manager, favoriteRepository })
    this.manager_ = manager;
    this.repository = favoriteRepository;
  }


  async create(product_id: string, customer_id: string) {
    var fav: DeepPartial<Favorite> = { product: product_id, customer: customer_id };
    const item = this.repository.create(fav);
    return await this.repository.save(item);
  }

  async list() {
    try {
      return await this.repository.find({
        relations: ['product']
      });

    } catch (error) {
      console.log(error)
      return [];
    }
  }

  async delete(id: string) {
    return await this.repository.delete({ id })
  }
}

export default FavoriteService;