import { TransactionBaseService } from "@medusajs/medusa"
import { EntityManager, FindOneOptions, Repository } from "typeorm";
import { CustomProduct } from "../models/custom-product";
import { GraphicSize } from "../models/graphic-size";
import { CustomizerArea } from "../models/customizer-area";
import { SizeTable } from "../models/size-table";
import { CustomProductSizing } from "../models/custom-product-sizing";
import { CustomProductStyle } from "../models/custom-product-style";
import { CustomMaterial } from "../models/custom-material";
import { MaterialType } from "../models/material-type";
import { CustomizerName } from "../models/customizer-name";
import { Product } from "../models/product";
import { Graphic } from "../models/graphics";



// import { Gallery } from "../models/gallery";


class CustomSettingsService extends TransactionBaseService {
  private productRepo: Repository<CustomProduct>;
  private graphicSizeRepo: Repository<GraphicSize>;
  private customizerAreaRepo: Repository<CustomizerArea>;
  private materialRepo: Repository<MaterialType>;
  private sizeTableRepo: Repository<SizeTable>;
  private customProductSizingRepo: Repository<CustomProductSizing>;
  private customizerStyles: Repository<CustomProductStyle>;
  private nameRepo: Repository<CustomizerName>;

  constructor({ manager }) {
    super({ manager })
    this.manager_ = manager;
    this.productRepo = this.manager_.getRepository(CustomProduct);
    this.graphicSizeRepo = this.manager_.getRepository(GraphicSize);
    this.customizerAreaRepo = this.manager_.getRepository(CustomizerArea)
    this.materialRepo = this.manager_.getRepository(MaterialType)
    this.sizeTableRepo = this.manager_.getRepository(SizeTable)
    this.customProductSizingRepo = this.manager_.getRepository(CustomProductSizing)
    this.customizerStyles = this.manager_.getRepository(CustomProductStyle)
    this.nameRepo = this.manager_.getRepository(CustomizerName)
  }


  async create(obj: any) {
    // const item = this.repository.create(obj);
    // return await this.repository.save(item);
  }

  async get(id: string) {
    return [];
  }

  async list() {
    var names = await this.nameRepo.find();
    var custom_products = this.productRepo.find()
    var styles = this.customizerStyles.find()
    var materials = this.materialRepo.find()
    return {
      names,
      custom_products,
      styles,
      materials
    }
  }

  async update(v1, v2) {
    return false
  }

  async delete(id: any) {
    // return {await this.repository.delete({ id })}
    return {}
  }
}

export default CustomSettingsService;