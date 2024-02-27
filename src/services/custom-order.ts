import { Order, OrderService as MedusaOrderService, Cart, DraftOrder } from "@medusajs/medusa";
import { Repository } from "typeorm";

class CustomOrderService extends MedusaOrderService {
  private repository: Repository<Order>
  constructor(container) {
    super(container);
    this.repository = container.orderRepository;
  }

  async createNewOrder(cart: Cart): Promise<DraftOrder | undefined> {
    if (cart) {
      var draft = await this.draftOrderService_.create({
        items: cart.items,
        discounts: cart.discounts,
        email: cart.email,
        region_id: cart.region_id,
        shipping_methods: [],
        metadata: {
          status: 'checkout'
        }
      },)
      return draft
    }
  }

}

export default CustomOrderService;