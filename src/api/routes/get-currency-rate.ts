import { Router } from "express";
import { json } from 'body-parser';
import { wrapHandler } from "@medusajs/medusa";
import cors from "cors";
import axios from 'axios';
import { Currency } from "@medusajs/medusa";

export interface CurrencyWithRate extends Currency {
  rate: string;
}


const router = Router();

export default function getCurrencyRate(CorsOptions): Router {

  router.use(cors(CorsOptions), json());
  router.get('/store/currency-rate', wrapHandler(async (req, res) => {
    const storeService = req.scope.resolve('newStoreService');
    const data = await storeService.list()

    res.status(200).json({
      data
    })

  }));

  router.get('/store/update-rate', wrapHandler(async (req, res) => {
    const storeService = req.scope.resolve('newStoreService');
    let data = await storeService.list()
    data.storeCurrencies[0].currencies.map(async (i) => {
      const converted_amount = await getRate(i.code)
      storeService.updateCurrencyRate(i.code, converted_amount?.new_amount)
    })
    data = await storeService.list()
    res.status(200).json({
      data
    })
  }));

  router.get('/store/pricing', wrapHandler(async (req, res) => {
    const storeService = req.scope.resolve('updateVariantService');
    const storeService1 = req.scope.resolve('newStoreService');
    const data1 = await storeService1.list()
    const variants = await storeService.getAllVariantIds()
    variants.map(async (variant) => {
      const priceUpdates: CurrencyWithRate[] = data1.storeCurrencies[0].currencies.map((currency: CurrencyWithRate) => ({
        currency_code: currency.code,
        rate: currency.rate, // Set a default rate value if not provided
        currency: { ...currency },
      }));
      
      await storeService.updatePrice(variant, priceUpdates);
    })
    
    
    // data.storeCurrencies[0].currencies.map(async (i)=>{
    //   const converted_amount = await getRate(i.code)
    //   storeService.updateCurrencyRate(i.code, converted_amount?.new_amount)
    // })
    res.status(200).json({
      data1
    })
  }));

  router.get('/store/update-price/:variant', wrapHandler(async (req, res) => {
    const storeService = req.scope.resolve('updateVariantService');
    const storeService1 = req.scope.resolve('newStoreService');
    const data1 = await storeService1.list()
    const { variant } = req.params;

    const priceUpdates: CurrencyWithRate[] = data1.storeCurrencies[0].currencies.map((currency: CurrencyWithRate) => ({
      currency_code: currency.code,
      rate: currency.rate, // Set a default rate value if not provided
      currency: { ...currency },
    }));
    await storeService.updatePrice(variant, priceUpdates);
 
    
    
    res.status(200).json({
      data1
    })
  }));


  const getRate = async (currency: string) => {
    const options = {
      method: 'GET',
      url: 'https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency',
      params: {
        have: 'USD',
        want: currency,
        amount: '1'
      },
      headers: {
        'X-RapidAPI-Key': '2026ccf6f6msh6e0c4f570e7067dp18149fjsna087888d48c8',
        'X-RapidAPI-Host': 'currency-converter-by-api-ninjas.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      return { status: "success", ...response.data }
    } catch (error) {
      console.error(error);
      return { "status": "error" }
    }
  }


  return router;
}
