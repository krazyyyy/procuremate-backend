import { Customer } from "@medusajs/medusa"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { CustomerRepository as MedusaCustomerRepository } from "@medusajs/medusa/dist/repositories/customer"

export const CustomerRepository = dataSource
  .getRepository(Customer)
  .extend({
    ...Object.assign(MedusaCustomerRepository, { target: Customer }),
    async updateHasAccount(customerId: string, hasAccount: boolean) {
      const customer = await this.findOne({ where: { id: customerId } })
      if (customer) {
        customer.has_account = hasAccount;
        await this.manager.save(customer);
      }
    }
  })


export default CustomerRepository