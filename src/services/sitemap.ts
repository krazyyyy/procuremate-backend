import { ProductCategory, ProductCollection, TransactionBaseService, } from "@medusajs/medusa";
import { Repository } from "typeorm";
import { Product } from "../models/product";
import { Gallery } from "../models/gallery";

type CategoryInterface = {
  handle: string;
  lastmod: string;
  image: {
    title: string;
    loc: string;
  };
}


const categoryImages = [
  {
    img: "/category-images/boxing_robe.png",
    name: "robes"
  },
  {
    img: "/category-images/muaythai_short.png",
    name: "muay thai shorts"
  },
  {
    img: "/category-images/jacket.png",
    name: "jackets"
  },
  {
    img: "/category-images/vest.png",
    name: "vests"
  },
  {
    img: "/category-images/t_shirt.png",
    name: "t-shirts sponsor"
  },
  {
    img: "/category-images/mmashort.png",
    name: "mma shorts"
  },
  {
    img: "/category-images/sport_bra.png",
    name: "sports bra"
  },
  {
    img: "/category-images/gladiator_short.png",
    name: "gladiator shorts"
  },
  {
    img: "/category-images/boxingshorts_and_jacket(premium_item).png",
    name: "boxing and jacket set (premium design)"
  },
  {
    img: "/category-images/glove.png",
    name: "boxing gloves"
  },
  {
    img: "/category-images/head_guard.png",
    name: "head guard"
  },
  {
    img: "/category-images/gorin guard.png",
    name: "groin guard"
  },
  {
    img: "/category-images/pads.png",
    name: "pads"
  },
  {
    img: "/category-images/boxing_short.png",
    name: "boxing shorts"
  }
];

// Helper function to find the image URL based on category name
const getImageUrlByCategoryName = (categoryName: string) => {
  const lowerCaseCategoryName = categoryName.toLowerCase();
  const categoryImage = categoryImages.find((category) =>
    category.name.toLowerCase().includes(lowerCaseCategoryName.replace("&", "and"))
  );
  return categoryImage ? categoryImage.img : null;
};
class SitemapService extends TransactionBaseService {
  _productRepository: Repository<Product>;
  _categoryRepository: Repository<ProductCategory>;
  _collectionRepository: Repository<ProductCollection>;
  _galleryRepository: Repository<Gallery>;

  constructor({
    manager,
    productRepository,
    productCategoryRepository,
    productCollectionRepository,
    galleryRepository,
  }) {
    super({
      manager,
      productRepository,
      productCategoryRepository,
      productCollectionRepository,
      galleryRepository,
    });
    this._productRepository = productRepository;
    this._categoryRepository = productCategoryRepository;
    this._collectionRepository = productCollectionRepository;
    this._galleryRepository = galleryRepository;
  }

  async productHasCategory(product: Product): Promise<ProductCategory | null> {
    try {
      const category = await this._categoryRepository.findOne({
        where: {
          products: {
            id: product.id,
          },
        },
      });
      return category || null;
    } catch (error) {
      return null;
    }
  }

  async fetchCollectionAndCategoriesHandle(
    collections: ProductCollection[],
    categories: ProductCategory[]
  ) {
    const urls = await Promise.all(
      collections.map(async (collection) =>
        Promise.all(
          categories.map(async (category) =>
            this.validateCategoryAndCollectionAndRetrieveURLs(
              category?.handle,
              collection?.handle,
              collections,
            )
          )
        )
      )
    );
    console.log(urls)
    const flattenedArray = new Set(urls.reduce((result, subArray) => result.concat(...subArray), []));
    var array = [...flattenedArray]

    const uniqueArray = array.filter((item, index, self) => {
      const jsonString = JSON.stringify(item);
      return index === self.findIndex(obj => JSON.stringify(obj) === jsonString);
    });
    return uniqueArray;
  }


  async getCollectionURLs() {

  }


  async galleryURLs() {
    var galleries = await this._galleryRepository.find();
    return galleries.map((g) => {
      return {
        handle: `/gallery/${g.handle}`,
        image: {
          title: g.title,
          loc: `${g.images[0]}`
        },
        lastmod: g.updated_at.toISOString(),
        freq: process.env.GALLERY_CHANGE_FREQ || 'daily'
      }
    });
  }

  async getURLs() {
    const [products, collections, categories] = await Promise.all([
      this._productRepository.find({ relations: ['collection'] }),
      this._collectionRepository.find(),
      this._categoryRepository.find(),
    ]);

    const productURLs = await Promise.all(
      products.map(async (product) => {
        const category = await this.productHasCategory(product);
        return category ? {
          handle: `/${product.collection.handle}/${category.handle}/${product.handle}`,
          image: {
            title: product.title,
            loc: `${product.thumbnail}`
          },
          freq: process.env.PRODUCT_CHANGE_FREQ || 'daily',
          lastmod: product.updated_at.toISOString(),
        } : null;
      })
    );

    const collections_categories = await this.fetchCollectionAndCategoriesHandle(
      collections,
      categories
    );

    return {
      products: productURLs.filter((item) => item !== null),
      collections: collections.map((col) => {
        return {
          handle: `/${col.handle}`,
          freq: process.env.COLLECTION_CHANGE_FREQ || 'daily',
          lastmod: col.updated_at.toISOString()
        }
      }),
      categories: collections_categories.map((item: any) => {
        console.log('item', item)
        return {
          ...item,
          freq: process.env.CATEGORY_CHANGE_FREQ || 'daily',
        }
      }),
    };
  }


  async validateCategoryAndCollectionAndRetrieveURLs(
    categoryHandle: string,
    collectionHandle: string,
    collections: ProductCollection[]
  ): Promise<CategoryInterface[]> {
    const category = await this._categoryRepository.findOne({
      where: { handle: categoryHandle },
      relations: ['products'],
    });

    const products = category.products.filter((product) => {
      var collection = collections.find((c) => c.handle === collectionHandle);
      return product.collection_id === collection.id;
    });

    return products.map((p) => {
      return {
        handle: `/${collectionHandle}/${categoryHandle}`,
        lastmod: category.updated_at.toISOString(),
        image: {
          title: category.name,
          loc: getImageUrlByCategoryName(category.name),
        }
      }
    });
  }

  async findCategoryByProductId(productId: string) {
    const category = await this._categoryRepository.findOne({
      where: {
        products: {
          id: productId,
        },
      },
    });
    return category || null;
  }
}

export default SitemapService;
