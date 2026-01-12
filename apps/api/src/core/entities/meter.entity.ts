import type { EntityStatus } from "../../shared/types/common.types";

/**
 * Meter entity with business logic
 */
export class Meter {
  constructor(
    public id: string,
    public meterNumber: string,
    public customerId: number | null,
    public location: string,
    public installationDate: Date,
    public status: EntityStatus,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  /**
   * Assign meter to a customer
   */
  assignToCustomer(customerId: number): void {
    this.customerId = customerId;
    this.updatedAt = new Date();
  }

  /**
   * Unassign meter from customer
   */
  unassign(): void {
    this.customerId = null;
    this.updatedAt = new Date();
  }

  /**
   * Deactivate meter
   */
  deactivate(): void {
    this.status = "inactive";
    this.updatedAt = new Date();
  }

  /**
   * Activate meter
   */
  activate(): void {
    this.status = "active";
    this.updatedAt = new Date();
  }

  /**
   * Check if meter is active
   */
  isActive(): boolean {
    return this.status === "active";
  }

  /**
   * Check if meter is assigned to a customer
   */
  isAssigned(): boolean {
    return this.customerId !== null;
  }

  /**
   * Validate meter data
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.meterNumber || this.meterNumber.trim().length === 0) {
      errors.push("Meter number is required");
    }

    if (!this.location || this.location.trim().length === 0) {
      errors.push("Location is required");
    }

    if (!this.installationDate) {
      errors.push("Installation date is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
