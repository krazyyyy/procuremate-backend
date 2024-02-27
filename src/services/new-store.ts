import { Currency, StoreService } from "@medusajs/medusa";
import { Repository } from "typeorm";
import { ProductVariantPrice } from "@medusajs/medusa/dist/types/product-variant";

export default class NewStoreService extends StoreService {
  repository: Repository<Currency> | undefined;
  constructor(container) {
    super(container);
    this.repository = this.currencyRepository_;
  }



  async list() {
    var currencies = await this.repository.find();
    var storeCurrencies = await this.storeRepository_.find({
      relations: ['currencies'],
    });
  
    // Create a map of currency code to rate
    var currencyMap = {};
    currencies.forEach(currency => {
      currencyMap[currency.code] = currency?.rate;
    });
  
    // Iterate through storeCurrencies and add the rate for each currency
    storeCurrencies.forEach(storeCurrency => {
      storeCurrency.currencies.forEach(currency => {
        currency.rate = currencyMap[currency.code];
      });
    });
  
    return { storeCurrencies };
  }
  
  async updateCurrencyRate(currencyCode, newRate) {
    // Find the currency with the given code
    var currency = await this.repository.findOne({ where: { code: currencyCode } });

    if (currency) {
      // Update the rate
      currency.rate = newRate;
    
      // Save the updated currency
      await this.repository.save(currency);
    
      return { success: true, message: 'Currency rate updated successfully.' };
    } else {
      return { success: false, message: 'Currency not found.' };
    }
  }
  
  
}