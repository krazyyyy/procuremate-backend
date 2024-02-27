import { Repository } from "typeorm"
import { Gallery } from "../models/gallery"
import {
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const GalleryRepository = dataSource.getRepository(Gallery);

export default GalleryRepository as Repository<Gallery>;
