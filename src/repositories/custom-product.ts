import { Repository } from "typeorm";
import { CustomProduct } from "../models/custom-product";
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const CustomProductRepository = dataSource.getRepository(CustomProduct);
export default CustomProductRepository as Repository<CustomProduct>;
