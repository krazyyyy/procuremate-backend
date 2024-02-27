import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { CustomMaterial } from '../models/custom-material';

export const CustomMaterialRepository = dataSource.getRepository(CustomMaterial);
export default CustomMaterialRepository;