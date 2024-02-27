import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { CustomColorGroup } from '../models/custom-color-group';

export const CustomColorGroupRepository = dataSource.getRepository(CustomColorGroup);
export default CustomColorGroupRepository;