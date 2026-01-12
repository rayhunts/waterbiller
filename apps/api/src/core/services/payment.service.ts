import type { IPaymentRepository, IBillRepository } from "../interfaces/repositories.interface";
import { Payment } from "../entities/payment.entity";

/**
 * Payment Service
 * Handles business logic for payment management
 */
export class PaymentService {
  constructor(
    private paymentRepository: IPaymentRepository,
    private billRepository: IBillRepository
  ) {}

  /**
   * Record a new payment
   */
  async recordPayment(data: {
    billId: string;
    amount: number;
    paymentMethod: "cash" | "card" | "bank_transfer" | "mobile_money";
    transactionReference?: string;
  }): Promise<Payment> {
    // Validate bill exists
    const bill = await this.billRepository.findById(data.billId);
    if (!bill) {
      throw new Error("Bill not found");
    }

    if (bill.status === "cancelled") {
      throw new Error("Cannot make payment for a cancelled bill");
    }

    if (bill.status === "paid") {
      throw new Error("Bill is already fully paid");
    }

    // Business rule: Payment amount should not exceed bill amount
    if (data.amount > bill.totalAmount) {
      throw new Error(
        `Payment amount ($${data.amount}) exceeds bill amount ($${bill.totalAmount})`
      );
    }

    // Create payment entity
    const payment = new Payment(
      crypto.randomUUID(),
      data.billId,
      bill.customerId,
      data.amount,
      new Date(),
      data.paymentMethod,
      data.transactionReference || `TXN-${Date.now()}`,
      "success",
      new Date()
    );

    // Save payment
    const savedPayment = await this.paymentRepository.create({
      billId: payment.billId,
      customerId: payment.customerId,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      transactionReference: payment.transactionReference,
    });

    // Check if bill is now fully paid
    const existingPayments = await this.paymentRepository.findByBillId(data.billId);
    const totalPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= bill.totalAmount) {
      // Mark bill as paid
      bill.markAsPaid();
      await this.billRepository.update(data.billId, { status: bill.status });
    }

    return savedPayment;
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment | null> {
    return await this.paymentRepository.findById(paymentId);
  }

  /**
   * Get all payments
   */
  async getAllPayments(): Promise<Payment[]> {
    return await this.paymentRepository.findAll();
  }

  /**
   * Get payments by customer ID
   */
  async getPaymentsByCustomerId(customerId: number): Promise<Payment[]> {
    return await this.paymentRepository.findByCustomerId(customerId);
  }

  /**
   * Get payments by bill ID
   */
  async getPaymentsByBillId(billId: string): Promise<Payment[]> {
    return await this.paymentRepository.findByBillId(billId);
  }

  /**
   * Calculate total payments for a bill
   */
  async calculateTotalPayments(billId: string): Promise<number> {
    const payments = await this.paymentRepository.findByBillId(billId);
    return payments
      .filter(p => p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0);
  }

  /**
   * Generate payment receipt
   */
  async generateReceipt(paymentId: string): Promise<{
    payment: Payment;
    bill: any;
    customer: any;
  }> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    const bill = await this.billRepository.findById(payment.billId);
    if (!bill) {
      throw new Error("Associated bill not found");
    }

    // In a real implementation, we'd fetch customer details here
    return {
      payment,
      bill,
      customer: { id: bill.customerId },
    };
  }
}
