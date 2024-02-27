import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Repository } from 'typeorm';
import { CustomizerArea } from '../models/customizer-area';

export const customizerAreaRepository = dataSource.getRepository(CustomizerArea);
export default customizerAreaRepository as Repository<CustomizerArea>;