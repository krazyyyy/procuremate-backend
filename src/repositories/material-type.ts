import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { MaterialType } from '../models/material-type';

export const MaterialTypeRepository = dataSource.getRepository(MaterialType);
export default MaterialTypeRepository;