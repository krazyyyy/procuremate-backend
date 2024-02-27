import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { CustomProductSizing } from "../models/custom-product-sizing";
import { Repository } from 'typeorm';

export const CustomProductSizingRepository = dataSource.getRepository(CustomProductSizing);
export default CustomProductSizingRepository as Repository<CustomProductSizing>;