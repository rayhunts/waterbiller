import type { ICustomerRepository } from "../interfaces/repositories.interface";
import { Customer } from "../entities/customer.entity";

/**
 * Customer Service
 * Handles business logic for customer management
 */
export class CustomerService {
  constructor(private customerRepository: ICustomerRepository) {}

  /**
   * Create a new customer
   */
  async createCustomer(data: {
    name: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    address?: string;
  }): Promise<Customer> {
    // Business rule: Validate email uniqueness is handled by repository
    return await this.customerRepository.create(data);
  }

  /**
   * Update customer information
   */
  async updateCustomer(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      address: string;
    }>
  ): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }

    return await this.customerRepository.update(id, data);
  }

  /**
   * Deactivate a customer
   */
  async deactivateCustomer(id: number): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }

    customer.deactivate();
    await this.customerRepository.update(id, { status: customer.status });
  }

  /**
   * Activate a customer
   */
  async activateCustomer(id: number): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }

    customer.activate();
    await this.customerRepository.update(id, { status: customer.status });
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(id: number): Promise<Customer | null> {
    return await this.customerRepository.findById(id);
  }

  /**
   * Get all customers
   */
  async getAllCustomers(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }

  /**
   * Search customers by name, account number, or phone
   */
  async searchCustomers(query: string): Promise<Customer[]> {
    return await this.customerRepository.search(query);
  }

  /**
   * Get customer billing history
   */
  async getCustomerBillingHistory(customerId: number) {
    // This would typically call billRepository through dependency injection
    // For now, this is handled directly in the route
    return [];
  }

  /**
   * Get customer payment history
   */
  async getCustomerPaymentHistory(customerId: number) {
    // This would typically call paymentRepository through dependency injection
    // For now, this is handled directly in the route
    return [];
  }
}
