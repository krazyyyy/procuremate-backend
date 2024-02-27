import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Repository } from 'typeorm';
import { CustomizerGraphic } from '../models/customizer-graphic';

export const customizerGraphic = dataSource.getRepository(CustomizerGraphic);
export default customizerGraphic as Repository<CustomizerGraphic>;