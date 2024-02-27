import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Repository } from 'typeorm';
import { CustomDesign } from '../models/custom-design';

export const CustomDesignRepository = dataSource.getRepository(CustomDesign);
export default CustomDesignRepository as Repository<CustomDesign>;