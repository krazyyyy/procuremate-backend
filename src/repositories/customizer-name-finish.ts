import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Repository } from 'typeorm';
import { CustomizerNameFinishes } from '../models/customizer-name-finishes';

export const customizerNameFinishRepository = dataSource.getRepository(CustomizerNameFinishes);
export default customizerNameFinishRepository as Repository<CustomizerNameFinishes>;