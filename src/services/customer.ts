import { Customer, FindConfig, CustomerService as MedusaCustomerService, Selector } from "@medusajs/medusa";
import { CreateCustomerInput } from "@medusajs/medusa/dist/types/customers";
import { MedusaError } from "medusa-core-utils"

interface Data {
  count: number;
  limit: number;
  offset: number;
  customers: Customer[];
}

class CustomerService extends MedusaCustomerService {
  repository: any;
  constructor(args) {
    super(args);
    this.repository = args.customerRepository;
  }


  async list(selector?: Selector<Customer> & { q?: string; groups?: string[]; }, config: FindConfig<Customer> = { relations: [], skip: 0, take: 50 }): Promise<Data> {
    const customerRepo = this.repository;
    let q;
    if ("q" in selector) {
      q = selector.q;
      delete selector.q;
    }
    const query = {
      ...selector,
      order: {
        created_at: "DESC",
      },
      ...config
    };
    const [customers, count] = await customerRepo.findAndCount(query);
    const data = {
      count: count,
      limit: config.take,
      offset: config.skip,
      customers: customers,
    }
    return data;
  }


  /**
   * Creates a customer from an email - customers can have accounts associated,
   * e.g. to login and view order history, etc. If a password is provided the
   * customer will automatically get an account, otherwise the customer is just
   * used to hold details of customers.
   * @param {object} customer - the customer to create
   * @return {Promise} the result of create
   */
  async create(customer: CreateCustomerInput): Promise<Customer> {
    return await this.atomicPhase_(async (manager) => {
      const customerRepository = manager.withRepository(this.customerRepository_);
      customer.email = customer.email.toLowerCase();

      const { email, password } = customer;

      const existing: Customer[] = await this.listByEmail(email).catch(() => []);

      if (existing && Array.isArray(existing) && existing?.some((customer) => customer.has_account) && password) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          "A customer with the given email already has an account. Log in instead"
        );
      } else if (existing && Array.isArray(existing) && existing?.some((customer) => !customer.has_account) && password) {
        const cus = await this.update(existing[0].id, { password });
        this.updateHasAccount(existing[0].id, true);
        await this.eventBusService_.withTransaction(manager).emit(CustomerService.Events.UPDATED, cus);
        console.log('customer updated ✅', cus);
        return cus;
      }

      if (password) {
        const hashedPassword = await this.hashPassword_(password);
        customer.password_hash = hashedPassword;
        customer.has_account = true;
        delete customer.password;
      }

      const created = customerRepository.create(customer);
      const result = await customerRepository.save(created);

      await this.eventBusService_.withTransaction(manager).emit(CustomerService.Events.CREATED, result);

      return result;
    });
  }

  async updateHasAccount(customerId: string, hasAccount: boolean) {
    return this.repository.updateHasAccount(customerId, hasAccount);
  }

  async delete(customerId: string): Promise<void | Customer> {
    return await this.repository.softDelete(customerId);
  }
}

export default CustomerService;