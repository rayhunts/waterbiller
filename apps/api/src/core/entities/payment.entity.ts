import type { PaymentMethod, PaymentStatus } from "../../shared/types/common.types";

/**
 * Payment entity with business logic
 */
export class Payment {
  constructor(
    public id: string,
    public billId: string,
    public customerId: number,
    public amount: number,
    public paymentDate: Date,
    public paymentMethod: PaymentMethod,
    public transactionReference: string,
    public status: PaymentStatus,
    public createdAt: Date
  ) {}

  /**
   * Check if payment is successful
   */
  isSuccessful(): boolean {
    return this.status === "success";
  }

  /**
   * Check if payment is pending
   */
  isPending(): boolean {
    return this.status === "pending";
  }

  /**
   * Check if payment failed
   */
  isFailed(): boolean {
    return this.status === "failed";
  }

  /**
   * Mark payment as successful
   */
  markAsSuccess(): void {
    this.status = "success";
  }

  /**
   * Mark payment as failed
   */
  markAsFailed(): void {
    this.status = "failed";
  }

  /**
   * Verify payment (simple verification logic)
   */
  verify(): boolean {
    return (
      this.amount > 0 &&
      this.transactionReference.length > 0 &&
      this.isSuccessful()
    );
  }

  /**
   * Get payment method display name
   */
  getPaymentMethodDisplay(): string {
    const methodMap: Record<PaymentMethod, string> = {
      cash: "Cash",
      card: "Card",
      bank_transfer: "Bank Transfer",
      mobile_money: "Mobile Money",
    };

    return methodMap[this.paymentMethod];
  }

  /**
   * Validate payment data
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.billId) {
      errors.push("Bill ID is required");
    }

    if (!this.customerId) {
      errors.push("Customer ID is required");
    }

    if (this.amount <= 0) {
      errors.push("Amount must be greater than zero");
    }

    if (!this.paymentDate) {
      errors.push("Payment date is required");
    }

    if (!this.paymentMethod) {
      errors.push("Payment method is required");
    }

    if (!this.transactionReference || this.transactionReference.trim().length === 0) {
      errors.push("Transaction reference is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create a new payment
   */
  static create(
    id: string,
    billId: string,
    customerId: number,
    amount: number,
    paymentDate: Date,
    paymentMethod: PaymentMethod,
    transactionReference: string,
    status: PaymentStatus = "success"
  ): Payment {
    return new Payment(
      id,
      billId,
      customerId,
      amount,
      paymentDate,
      paymentMethod,
      transactionReference,
      status,
      new Date()
    );
  }
}
