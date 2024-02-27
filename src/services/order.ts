import { Order, OrderService as MedusaOrderService, Customer, Payment, Cart, Selector, FindConfig, buildQuery, buildSelects, buildRelations, QuerySelector } from "@medusajs/medusa";
import { FindManyOptions, FindOptionsWhere, ILike, IsNull, Not, Raw } from "typeorm";

class OrderService extends MedusaOrderService {
  constructor(container) {
    super(container);

    this.eventBus_.subscribe('payment.updated', async ({ id }: Payment) => {
      if (this.paymentProviderService_) {
        const payment = await this.paymentProviderService_?.retrievePayment(id, ['order']);
        const order = await this.orderRepository_.findOne({ where: { id: payment.order.id }, relations: ['shipping_address'] })
      }
    });
  }

  /**
  * @param {Object} selector - the query object for find
  * @param {Object} config - the config to be used for find
  * @return {Promise} the result of the find operation
  */
  async listAndCount(
    selector: QuerySelector<Order>,
    config: FindConfig<Order> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<[Order[], number]> {
    const orderRepo = this.activeManager_.withRepository(this.orderRepository_)

    let q
    if (selector.q) {
      q = selector.q
      delete selector.q

      config.relations = config.relations
        ? Array.from(
          new Set([...config.relations, "shipping_address", "customer"])
        )
        : ["shipping_address", "customer"]
    }

    const query = buildQuery(selector, config) as FindManyOptions<Order>

    if (q) {
      const where = query.where as FindOptionsWhere<Order>

      delete where.display_id
      delete where.email

      // Inner join like constraints
      const innerJoinLikeConstraints = {
        customer: {
          id: Not(IsNull()),
        },
        shipping_address: {
          id: Not(IsNull()),
        },
      }

      query.where = [
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          shipping_address: {
            ...innerJoinLikeConstraints.shipping_address,
            id: Not(IsNull()),
            first_name: ILike(`%${q}%`),
          },
        },
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          email: ILike(`%${q}%`),
        },
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          display_id: Raw((alias) => `CAST(${alias} as varchar) ILike :q`, {
            q: `%${q}%`,
          }),
        },
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          customer: {
            ...innerJoinLikeConstraints.customer,
            first_name: ILike(`%${q}%`),
          },
        },
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          customer: {
            ...innerJoinLikeConstraints.customer,
            last_name: ILike(`%${q}%`),
          },
        },
        {
          ...query.where,
          ...innerJoinLikeConstraints,
          customer: {
            ...innerJoinLikeConstraints.customer,
            phone: ILike(`%${q}%`),
          },
        },
      ]
    }

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals(config)
    query.select = buildSelects(select || [])
    const rels = buildRelations(this.getTotalsRelations({ relations }))
    delete query.relations

    const raw = await orderRepo.findWithRelations(rels, query)
    const count = await orderRepo.count(query)
    const orders = await Promise.all(
      raw.map(async (r) => await this.decorateTotals(r, totalsToSelect))
    )
    for (var i in orders) {
      var order = orders[i];
      var newOrder = await this.retrieve(order.id);
      order.metadata = newOrder.metadata;
      orders[i] = order;
    }

    return [orders, count]
  }

  private override getTotalsRelations(config: FindConfig<Order>): string[] {
    const relationSet = new Set(config.relations)

    relationSet.add("items")
    relationSet.add("items.tax_lines")
    relationSet.add("items.adjustments")
    relationSet.add("items.variant")
    relationSet.add("swaps")
    relationSet.add("swaps.additional_items")
    relationSet.add("swaps.additional_items.tax_lines")
    relationSet.add("swaps.additional_items.adjustments")
    relationSet.add("claims")
    relationSet.add("claims.additional_items")
    relationSet.add("claims.additional_items.tax_lines")
    relationSet.add("claims.additional_items.adjustments")
    relationSet.add("discounts")
    relationSet.add("discounts.rule")
    relationSet.add("gift_cards")
    relationSet.add("gift_card_transactions")
    relationSet.add("refunds")
    relationSet.add("shipping_methods")
    relationSet.add("shipping_methods.tax_lines")
    relationSet.add("region")

    return Array.from(relationSet.values())
  }


  async registerUser(order: Order) {
    // Retrieve or create a customer, depending on your needs
    let customer: Customer | undefined;
    var customerService = this.customerService_ as any;

    // This assumes email is included in the order metadata
    const { email } = order;

    // Check if a customer with this email already exists
    const existingCustomer = await this.customerService_.list({ email });
    if (existingCustomer.length > 0) {
      // Customer already exists
      customer = existingCustomer[0];
      // Customer doesn't have an account - create an account for user;
      if (customer && !customer.has_account) {
        const { shipping_address } = order;
        customer = await customerService.update(customer.id, {
          last_name: shipping_address?.last_name ?? '',
          phone: shipping_address?.phone ?? '',
          email: order.email,
        },);
        try {
          await customerService.updateHasAccount(customer.id, true);
        } catch (error) {
          console.error(error);
        }
      }
      try {
        await this.update(order.id, { customer_id: customer.id, })
      } catch (error) {
        console.error(error)
      }
      return;
    } else {
      // Create a new customer
      customer = await customerService.create({ email, password: '12345678' });
    }
    console.log('customer is 🕵🏻‍♀️', customer)
    // Attach the customer to the order
    order.customer_id = customer.id;
    var res = await this.orderRepository_.update(order.id, { customer_id: customer.id });
    console.log("order updated ✅", res)
  }
}

export default OrderService;