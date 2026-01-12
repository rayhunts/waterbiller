import { paymentService } from "../../core/services";

/**
 * Payment Handler
 * Handles payment-related HTTP requests
 */
export class PaymentHandler {
  /**
   * Get all payments
   */
  static async getAll() {
    return await paymentService.getAllPayments();
  }

  /**
   * Get payment by ID
   */
  static async getById(id: string) {
    const payment = await paymentService.getPaymentById(id);
    if (!payment) {
      throw new Error("Payment not found");
    }
    return payment;
  }

  /**
   * Record payment
   */
  static async create(data: {
    billId: string;
    amount: number;
    paymentMethod: "cash" | "card" | "bank_transfer" | "mobile_money";
    transactionReference?: string;
  }) {
    return await paymentService.recordPayment(data);
  }

  /**
   * Get customer payments
   */
  static async getByCustomer(customerId: number) {
    return await paymentService.getPaymentsByCustomerId(customerId);
  }
}
