import { customerService, billRepository, paymentRepository } from "../../core/services";

/**
 * Customer Handler
 * Handles customer-related HTTP requests
 */
export class CustomerHandler {
  /**
   * Get all customers or search
   */
  static async getAll(query?: { search?: string }) {
    if (query?.search) {
      return await customerService.searchCustomers(query.search);
    }
    return await customerService.getAllCustomers();
  }

  /**
   * Get customer by ID
   */
  static async getById(id: number) {
    const customer = await customerService.getCustomerById(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  /**
   * Create new customer
   */
  static async create(data: {
    name: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    address?: string;
  }) {
    return await customerService.createCustomer(data);
  }

  /**
   * Update customer
   */
  static async update(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      address: string;
    }>
  ) {
    return await customerService.updateCustomer(id, data);
  }

  /**
   * Deactivate customer
   */
  static async delete(id: number) {
    await customerService.deactivateCustomer(id);
    return { message: "Customer deactivated successfully" };
  }

  /**
   * Get customer bills
   */
  static async getBills(id: number) {
    return await billRepository.findByCustomerId(id);
  }

  /**
   * Get customer payments
   */
  static async getPayments(id: number) {
    return await paymentRepository.findByCustomerId(id);
  }
}
