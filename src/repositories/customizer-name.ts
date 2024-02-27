import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Repository } from 'typeorm';
import { CustomizerName } from '../models/customizer-name';

export const customizerNameRepository = dataSource.getRepository(CustomizerName);
export default customizerNameRepository as Repository<CustomizerName>;