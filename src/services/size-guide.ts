import { TransactionBaseService } from "@medusajs/medusa";
import { Repository } from "typeorm";
import { SizeGuideKey } from "../models/size-column";
import SizeColumnValuesService from "./size-column";
// Define the order of sizes
const sizeOrder = ["x-small", "small", "medium", "large", "x-large", "xx-large", 'xxx-large', 'xxxx-large'];


class SizeGuideService extends TransactionBaseService {
  private keys_repository: Repository<SizeGuideKey>;
  private _sizeColumnService: SizeColumnValuesService;

  constructor({ manager, sizeColumnService }) {
    super({ manager });
    this.manager_ = manager;
    this._sizeColumnService = sizeColumnService;
    this.keys_repository = this.manager_.getRepository(SizeGuideKey);
  }
  async search(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.keys_repository.createQueryBuilder('size_guide_key')
      .leftJoinAndSelect('size_guide_key.category_id', 'ProductCategory')
      .andWhere(
        Object.keys(queryParams)
          .map((key) => `${key} LIKE :${key}`)
          .join(' AND '),
        queryParams
      );

    const [size_guide, totalCount] = await Promise.all([
      query
        .take(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .getMany(),
      query.getCount()
    ]);

    await Promise.all(
      size_guide.map(async (key) => {
        const newData = await this._sizeColumnService.search({ 'size_key': key.id }, 100000, 1);
        const values = newData.size_value.sort((a, b) => {
          const aIndex = sizeOrder.indexOf(a.column_one.toLowerCase());
          const bIndex = sizeOrder.indexOf(b.column_one.toLowerCase());

          if (aIndex === -1) return 1; // Move unknown sizes to the end
          if (bIndex === -1) return -1; // Move unknown sizes to the end

          return aIndex - bIndex;
        });
        key.type = key.type.toLowerCase()
        key['data'] = values
      })
    );

    const groupedData = size_guide.reduce((acc, item) => {
      const type = item.type || 'unknown';
      acc[type] = acc[type] || [];
      acc[type].push(item);
      return acc;
    }, {});

    const sizeGuide = Object.entries(groupedData).map(([type, items]) => ({ type, items }));

    return {
      totalCount,
      pageSize,
      pageNumber,
      size_guide: sizeGuide,
    };
  }
}

export default SizeGuideService;