import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { SizeTable } from "../models/size-table";

export const SizeTableRepository = dataSource.getRepository(SizeTable);
export default SizeTableRepository;