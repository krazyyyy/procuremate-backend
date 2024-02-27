import { LineItem } from "@medusajs/medusa"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { LineItemRepository as MedusaLineItemRepository } from "@medusajs/medusa/dist/repositories/line-item"

export const LineItemRepository = dataSource
  .getRepository(LineItem)
  .extend({
    ...Object.assign(MedusaLineItemRepository, { target: LineItem }),
  })


export default LineItemRepository