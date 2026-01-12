/**
 * Date utility functions for the water billing system
 */
export class DateUtils {
  /**
   * Add days to a given date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Format date as billing period (YYYY-MM)
   */
  static formatBillingPeriod(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  /**
   * Check if a bill is overdue
   */
  static isOverdue(dueDate: Date): boolean {
    return new Date() > dueDate;
  }

  /**
   * Calculate due date (30 days from billing date)
   */
  static calculateDueDate(billingDate: Date = new Date()): Date {
    return this.addDays(billingDate, 30);
  }

  /**
   * Format date to ISO string
   */
  static toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parse ISO string to Date
   */
  static fromISOString(isoString: string): Date {
    return new Date(isoString);
  }
}
