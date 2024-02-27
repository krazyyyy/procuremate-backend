import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { CustomizerColorGroup } from '../models/customizer-color-group';

export const CustomizerColorGroupRepository = dataSource.getRepository(CustomizerColorGroup);
export default CustomizerColorGroupRepository;