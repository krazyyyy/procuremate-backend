import { Repository } from "typeorm"
import { Graphic } from "../models/graphics"
import {
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const GraphicRepository = dataSource
  .getRepository(Graphic)

export default GraphicRepository as Repository<Graphic>;
