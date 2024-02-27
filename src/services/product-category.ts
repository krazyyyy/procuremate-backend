import { FindConfig, ProductCategoryService as MedusaProductCategoryService, ProductCategory, ProductCollection, QuerySelector, Selector, TreeQuerySelector } from "@medusajs/medusa";
import { Repository } from "typeorm";


class ProductCategoryService extends MedusaProductCategoryService {
  repository: Repository<ProductCategory>;
  collectionRepository: Repository<ProductCollection>
  constructor(container) {
    super(container)
    this.manager_ = container.manager;
    this.repository = container.productCategoryRepository;
    this.collectionRepository = container.productCollectionRepository;
  }
  async retrieve(productCategoryId: string, config?: FindConfig<ProductCategory>, selector?: Selector<ProductCategory>, treeSelector?: QuerySelector<ProductCategory>): Promise<ProductCategory> {
    const category = await this.repository.findOne({
      where: { id: productCategoryId },
      relations: ['products', 'category_children', 'parent_category']
    })
    return category;
  }

  async listAll(): Promise<ProductCategory[]> {
    const categories = await this.repository.find({});
    return categories;
  }

  async hasProductInCollection(categoryHandle: string, collectionHandle: string): Promise<boolean> {
    const category = await this.repository.findOne({
      where: { handle: categoryHandle },
      relations: ['products']
    })
    const products = [];
    for (var product of category.products) {
      const collection = await this.collectionRepository.findOne({ where: { id: product.collection_id } })
      if (collection.handle === collectionHandle) {
        products.push(product)
      }
    }

    return products.length > 0;
  }

  async findByProductId(productId: string) {
    var category = await this.repository.findOneBy({
      products: {
        id: productId,
      }
    });
    return category;

  }

  async delete(productCategoryId: string): Promise<void> {
    await this.repository.delete(productCategoryId);
  }
}

export default ProductCategoryService