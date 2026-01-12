import type { BillStatus } from "../../shared/types/common.types";
import { BillingCalculator } from "../../shared/utils/calculation.utils";
import { DateUtils } from "../../shared/utils/date.utils";

/**
 * Bill entity with business logic
 */
export class Bill {
  constructor(
    public id: string,
    public customerId: number,
    public meterReadingId: string | null,
    public billingPeriod: string,
    public previousReading: number,
    public currentReading: number,
    public consumption: number,
    public ratePerUnit: number,
    public baseCharge: number,
    public totalAmount: number,
    public dueDate: Date,
    public status: BillStatus,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  /**
   * Calculate bill amount using tiered pricing
   */
  static calculateAmount(consumption: number): number {
    const calculation = BillingCalculator.calculateBillAmount(consumption);
    return calculation.total;
  }

  /**
   * Mark bill as paid
   */
  markAsPaid(): void {
    this.status = "paid";
    this.updatedAt = new Date();
  }

  /**
   * Mark bill as overdue
   */
  markAsOverdue(): void {
    if (this.status === "pending" && this.isOverdue()) {
      this.status = "overdue";
      this.updatedAt = new Date();
    }
  }

  /**
   * Cancel bill
   */
  cancel(): void {
    this.status = "cancelled";
    this.updatedAt = new Date();
  }

  /**
   * Check if bill is overdue
   */
  isOverdue(): boolean {
    return DateUtils.isOverdue(this.dueDate) && this.status !== "paid" && this.status !== "cancelled";
  }

  /**
   * Check if bill is paid
   */
  isPaid(): boolean {
    return this.status === "paid";
  }

  /**
   * Check if bill is pending
   */
  isPending(): boolean {
    return this.status === "pending";
  }

  /**
   * Check if bill can be cancelled
   */
  canBeCancelled(): boolean {
    return this.status === "pending" || this.status === "overdue";
  }

  /**
   * Get days until due date (negative if overdue)
   */
  getDaysUntilDue(): number {
    const now = new Date();
    const diffTime = this.dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Validate bill data
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.customerId) {
      errors.push("Customer ID is required");
    }

    if (!this.billingPeriod) {
      errors.push("Billing period is required");
    }

    if (this.consumption < 0) {
      errors.push("Consumption must be non-negative");
    }

    if (this.totalAmount < 0) {
      errors.push("Total amount must be non-negative");
    }

    if (!this.dueDate) {
      errors.push("Due date is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create a new bill with calculated amounts
   */
  static create(
    id: string,
    customerId: number,
    meterReadingId: string | null,
    billingPeriod: string,
    previousReading: number,
    currentReading: number,
    consumption: number
  ): Bill {
    const calculation = BillingCalculator.calculateBillAmount(consumption);
    const dueDate = DateUtils.calculateDueDate();

    return new Bill(
      id,
      customerId,
      meterReadingId,
      billingPeriod,
      previousReading,
      currentReading,
      consumption,
      calculation.breakdown[0]?.rate || 0, // Store first tier rate for reference
      calculation.baseCharge,
      calculation.total,
      dueDate,
      "pending",
      new Date(),
      new Date()
    );
  }
}
