import { billingService, billRepository } from "../../core/services";

/**
 * Bill Handler
 * Handles bill-related HTTP requests
 */
export class BillHandler {
  /**
   * Get all bills with filters
   */
  static async getAll(query?: {
    status?: string;
    customerId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    if (!query || Object.keys(query).length === 0) {
      return await billRepository.findAll();
    }

    // Apply filters
    let bills = await billRepository.findAll();

    if (query.status) {
      bills = bills.filter((b) => b.status === query.status);
    }

    if (query.customerId) {
      bills = bills.filter((b) => b.customerId === parseInt(query.customerId!));
    }

    if (query.startDate) {
      const startDate = new Date(query.startDate);
      bills = bills.filter((b) => new Date(b.createdAt!) >= startDate);
    }

    if (query.endDate) {
      const endDate = new Date(query.endDate);
      bills = bills.filter((b) => new Date(b.createdAt!) <= endDate);
    }

    return bills;
  }

  /**
   * Get bill by ID
   */
  static async getById(id: string) {
    const bill = await billRepository.findById(id);
    if (!bill) {
      throw new Error("Bill not found");
    }
    return bill;
  }

  /**
   * Generate bill from reading
   */
  static async generate(readingId: string) {
    return await billingService.generateBillFromReading(readingId);
  }

  /**
   * Cancel bill
   */
  static async cancel(id: string) {
    return await billingService.cancelBill(id);
  }

  /**
   * Get overdue bills
   */
  static async getOverdue() {
    return await billRepository.findOverdue();
  }

  /**
   * Get dashboard statistics
   */
  static async getStats() {
    return await billingService.getDashboardStats();
  }

  /**
   * Get customer bills
   */
  static async getByCustomer(customerId: number) {
    return await billRepository.findByCustomerId(customerId);
  }
}
