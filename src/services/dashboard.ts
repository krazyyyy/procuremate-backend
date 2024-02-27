import { ProductVariant, TransactionBaseService } from "@medusajs/medusa";
import { Between } from "typeorm";

import { Order } from "@medusajs/medusa";

export default class DashboardService extends TransactionBaseService {
  private repository: any;

  constructor({ manager }) {
    super({ manager });
    this.manager_ = manager;
    this.repository = this.manager_.getRepository(Order);
  }

  async getOrdersByDateRange(startDate = null, endDate = null) {
    const currentDate = new Date();
    endDate = endDate ? new Date(endDate + 'T00:00:00') : currentDate;
    startDate = startDate ? new Date(startDate + 'T00:00:00') : new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);


    const orders = await this.repository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
      relations: ['items', 'items.variant', 'items.variant.product', 'items.variant.product.collection', 'payments'],
    });

    const sales = {
      'ready_made_sale': [],
      'custom_sale': [],
    };

    const dateSalesMap = {};

    let currentDatePointer = new Date(startDate);

    while (currentDatePointer <= endDate) {
      const currentDateStr = currentDatePointer.toDateString();
      dateSalesMap[currentDateStr] = {
        'ready_made_sale': 0,
        'custom_sale': 0,
      };
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }

    // ...

    for (const order of orders) {
      const orderDate = order.created_at.toDateString();

      for (const item of order.items) {
        const variant = item.variant;
        const collectionName = variant?.product?.collection?.title;

        if (collectionName === 'Ready Made') {
          dateSalesMap[orderDate]['ready_made_sale'] += item.unit_price / 100;
        } else {
          dateSalesMap[orderDate]['custom_sale'] += item.unit_price / 100;
        }
      }
    }

    // ...


    const dates = Object.keys(dateSalesMap);
    dates.sort((a, b) => new Date(a) - new Date(b));

    for (const date of dates) {
      sales['ready_made_sale'].push({ [date]: dateSalesMap[date]['ready_made_sale'] });
      sales['custom_sale'].push({ [date]: dateSalesMap[date]['custom_sale'] });
    }

    return sales;
  }

  async getProductsSoldByDateRange(startDate = null, endDate = null) {
    const currentDate = new Date();
    endDate = endDate ? new Date(endDate + 'T00:00:00') : currentDate;
    startDate = startDate ? new Date(startDate + 'T00:00:00') : new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const orders = await this.repository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
      relations: ['items', 'items.variant', 'items.variant.product', 'items.variant.product.collection'],
    });

    const products = {};

    for (const order of orders) {
      for (const item of order.items) {
        const variant = item.variant;
        const collectionName = variant?.product?.collection?.title;
        if (!products.hasOwnProperty(variant?.id)) {
          products[variant?.id] = {
            variantTitle: variant?.product?.title,
            collectionName: collectionName,
            totalSold: 0,
          };
        }
        products[variant?.id].totalSold += item.quantity;
      }
    }

    const productData = Object.entries(products).map(([variantId, data]) => {
      return {
        variantTitle: data.variantTitle,
        collectionName: data.collectionName,
        totalSold: data.totalSold,
      };
    });

    return productData;
  }

  async getOrderDetailsByDateRange(startDate = null, endDate = null, isReadyMade = false) {
    const currentDate = new Date();
    endDate = endDate ? new Date(endDate + 'T00:00:00') : currentDate;
    startDate = startDate ? new Date(startDate + 'T00:00:00') : new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const orders = await this.repository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
      relations: ['items', 'items.variant', 'items.variant.product', 'items.variant.product.collection', 'payments', 'shipping_methods'],
    });

    const dateSalesMap = {};

    let currentDatePointer = new Date(startDate);

    while (currentDatePointer <= endDate) {
      const currentDateStr = currentDatePointer.toDateString();
      dateSalesMap[currentDateStr] = {
        totalOrders: 0,
        totalSales: 0,
        totalShipping: 0,
      };
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }

    for (const order of orders) {
      const collectionName = order?.items[0]?.variant?.product?.collection?.title;

      if ((isReadyMade && collectionName === 'Ready Made') || (!isReadyMade && collectionName !== 'Ready Made')) {
        const orderDate = order.created_at.toDateString();

        dateSalesMap[orderDate].totalOrders += 1;

        for (const item of order.items) {
          dateSalesMap[orderDate].totalSales += item.unit_price / 100;
        }

        for (const shippingMethod of order.shipping_methods) {
          dateSalesMap[orderDate].totalShipping += shippingMethod.price / 100;
        }
      }
    }

    const dateSalesArray = Object.entries(dateSalesMap).map(([orderDate, data]) => {
      return {
        date: orderDate,
        totalOrders: data.totalOrders,
        totalSales: data.totalSales,
        totalShipping: data.totalShipping,
      };
    });

    return dateSalesArray;
  }

  async getPeriodDetails(startDate = null, endDate = null) {
    const currentDate = new Date();
    endDate = endDate ? new Date(endDate + 'T00:00:00') : currentDate;
    startDate = startDate ? new Date(startDate + 'T00:00:00') : new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const orders = await this.repository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
      relations: ['shipping_methods'],
    });

    let totalOrders = 0;
    let totalSales = 0;
    let totalShipping = 0;

    for (const order of orders) {
      totalOrders++;
      for (const item of order.items) {
        totalSales += item.unit_price / 100;
      }
      if (order.shipping_methods && order.shipping_methods.length > 0) {
        for (const shippingMethod of order.shipping_methods) {
          totalShipping += shippingMethod.price / 100;
        }
      }
    }

    const netSales = totalSales - totalShipping;

    const periodDetails = {
      totalOrders,
      totalSales,
      totalShipping,
      netSales,
    };

    return periodDetails;
  }


  async getOrderCountByDateRange(startDate = null, endDate = null) {
    const currentDate = new Date();
    endDate = endDate ? new Date(endDate + 'T00:00:00') : currentDate;
    startDate = startDate ? new Date(startDate + 'T00:00:00') : new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const orders = await this.repository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
    });

    const orderCountList = [];
    let currentDatePointer = new Date(startDate);

    while (currentDatePointer <= endDate) {
      const currentDateStr = currentDatePointer.toDateString();
      const orderCount = orders.filter((order) => order.created_at.toDateString() === currentDateStr).length;
      orderCountList.push({ [currentDate.toDateString()]: orderCount });
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }

    return orderCountList;
  }




}