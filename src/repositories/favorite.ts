import { Repository } from "typeorm"
import {
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import { Favorite } from "../models/favorite";

export const FavoriteRepository = dataSource.getRepository(Favorite);
export default FavoriteRepository as Repository<Favorite>;
