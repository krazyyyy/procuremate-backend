import { LineItemService as MedusaLineItemService, Selector } from "@medusajs/medusa";
import LineItemRepository from "../repositories/line-item";


class LineItemService extends MedusaLineItemService {
  repository: typeof LineItemRepository | undefined;
  constructor(container: any) {
    super(container);
    this.repository = container.lineItemRepository;
    this.manager_ = container.manager;
  }
}

export default LineItemService;