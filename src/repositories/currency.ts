import { Currency } from "../models/currency"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import{ CurrencyRepository as MedusaCurrencyRepo} from "@medusajs/medusa/dist/repositories/currency"
export const CurrencyRepository = dataSource
  .getRepository(Currency)
  .extend({
    ...Object.assign(MedusaCurrencyRepo, { target: Currency })
  })


export default CurrencyRepository