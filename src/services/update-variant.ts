import { ProductVariant, Order } from "@medusajs/medusa";
import { Repository } from "typeorm";
import { ProductVariantService } from "@medusajs/medusa";
import { MoneyAmount } from "@medusajs/medusa";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4 from the "uuid" library
import { Currency as MedusaCurrency } from "@medusajs/medusa";
import { TransactionBaseService } from "@medusajs/medusa";
import { currencies } from "../utils/currencies";

// import { getFormattedValue } from "utils/currencyUtils";

interface Currency extends MedusaCurrency {
  rate?: string;
}

const getFormattedValue = (value, currencyCode) => {
  const { symbol_native, decimal_digits } = currencies[
    currencyCode.toUpperCase()
  ]
  
  const formattedValue = parseInt(((value).toString()).replace(".", ""));
  return Math.floor(value);
};


export default class NewVariantService extends TransactionBaseService {
  repository: Repository<ProductVariant> | undefined;
  orderRepository: Repository<Order> | undefined;
  moneyAmountRepository_: Repository<MoneyAmount> | undefined;

  constructor({ manager }) {
    super(manager);
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(ProductVariant);
    this.moneyAmountRepository_ = this.manager_.getRepository(MoneyAmount);
    this.orderRepository = this.manager_.getRepository(Order);
  }

  async getAllVariantIds() {
    const variants = await this.repository.find();
    const variantIds = variants.map((variant) => variant.id);
    return variantIds;
  }
  

  async updatePrice(variantId: string, prices: any[]): Promise<void> {
    const existingPrices = await this.moneyAmountRepository_.find({ where: { variant_id: variantId } });

    const variant = await this.repository.find({ where: { id: variantId } });

    // Fetch the USD price amount from existing prices
    const usdPrice = existingPrices.find((price) => price.currency_code === 'usd');
    if (!usdPrice) {
      return;
    }
    // Iterate over existing prices and update them
    existingPrices.forEach((existingPrice) => {
      const matchingPrice = prices.find((price) => price.currency_code === existingPrice.currency_code);

      if (matchingPrice) {
        // Update existing price with new amount
        if (existingPrice.currency_code === 'usd' || matchingPrice.currency_code === 'USD') {
          // Skip updating USD price
          return;
        }

        const rate = parseFloat(matchingPrice.currency.rate) || 1; // Assuming rate is 1 for USD
        existingPrice.amount = usdPrice.amount * rate;
      }
    });

    // Add new prices for currency codes that don't exist in existing prices
    prices.forEach(async (newPrice) => {
      const matchingExistingPrice = existingPrices.find((price) => price.currency_code === newPrice.currency_code);

      if (!matchingExistingPrice) {
        newPrice.variant_id = variantId;
        // newPrice.variant = variant;
        // newPrice.id =  uuidv4();
        if (newPrice.currency_code === 'usd') {
          return;
        } else {
          const rate = parseFloat(newPrice.currency.rate) || 1;
          const originalNumber = usdPrice?.amount  * rate;
          const formattedValue = getFormattedValue(originalNumber, newPrice.currency_code);
          newPrice.amount = formattedValue;
        }

        delete newPrice.rate;
        const item = await this.moneyAmountRepository_.create(newPrice);
        const up = await this.moneyAmountRepository_.save(item);
      } else {
        matchingExistingPrice.variant_id = variantId;
        if (matchingExistingPrice.currency_code !== 'usd') {
          const rate = parseFloat(newPrice.currency.rate) || 1; // Assuming rate is 1 for USD

          const originalNumber = usdPrice?.amount * rate;
          const formattedValue = getFormattedValue(originalNumber, matchingExistingPrice.currency_code);
          matchingExistingPrice.amount = formattedValue;
        }

        matchingExistingPrice.variant = variant;

        const up = await this.moneyAmountRepository_.save(matchingExistingPrice);
      }
    });

  }

  async searchOrder(queryParams: any, pageSize: number, pageNumber: number) {
    const query = this.orderRepository.createQueryBuilder('orders')
    .leftJoinAndSelect('orders.items', 'Items')
    .leftJoinAndSelect('orders.customer', 'Customers')
    .leftJoinAndSelect('orders.payments', 'Payments')
    .leftJoinAndSelect('orders.shipping_address', 'Shipping_address')

      for (const key in queryParams) {
        if (key === 'display_id') {
          if (queryParams.hasOwnProperty(key)) {
            query.andWhere(`${key} = :${key}`, { [key]: queryParams[key] });
          }
        } else if ( key === "job_order_id") {
          if (queryParams.hasOwnProperty(key)) {
            query.andWhere(`job_cards.order_id = :${key}`, { [key]: queryParams[key] });
          }
        }
        else if (key === 'order_status') {
          query.andWhere("orders.metadata->>'status' ILIKE :status", {
            status: `%${queryParams[key]}%`,
          });      
        } else if (key === 'due_date' || key === 'send_date') {
          query.andWhere(`Order.metadata->>'${key}' = :${key}`, {
            [key]: queryParams[key],
          });
        } else {
          query.andWhere(`${key} LIKE :${key}`, {
            [key]: `%${queryParams[key]}%`,
          });
        }
      }

  const count = await query.getCount();
  const orders = await query
    .take(pageSize)
    .skip((pageNumber - 1) * pageSize)
    .getMany();

  return {
    count,
    pageSize,
    pageNumber,
    orders: orders,
  };
  }
}
