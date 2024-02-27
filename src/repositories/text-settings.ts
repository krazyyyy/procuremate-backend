import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { TextSettings } from '../models/text-settings';

export const TextSettingsRepository = dataSource.getRepository(TextSettings);
export default TextSettingsRepository;