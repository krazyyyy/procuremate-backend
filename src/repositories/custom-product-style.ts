import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Repository } from 'typeorm';
import { CustomProductStyle } from '../models/custom-product-style';

export const CustomProductStyleRepository = dataSource.getRepository(CustomProductStyle);
export default CustomProductStyleRepository as Repository<CustomProductStyle>;