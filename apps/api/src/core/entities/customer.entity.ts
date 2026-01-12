import type { EntityStatus } from "../../shared/types/common.types";

/**
 * Customer entity with business logic
 */
export class Customer {
  constructor(
    public id: number,
    public accountNumber: string,
    public name: string,
    public username: string,
    public email: string,
    public phone: string,
    public address: string,
    public status: EntityStatus,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  /**
   * Activate customer account
   */
  activate(): void {
    this.status = "active";
    this.updatedAt = new Date();
  }

  /**
   * Deactivate customer account
   */
  deactivate(): void {
    this.status = "inactive";
    this.updatedAt = new Date();
  }

  /**
   * Update contact information
   */
  updateContactInfo(phone: string, address: string): void {
    this.phone = phone;
    this.address = address;
    this.updatedAt = new Date();
  }

  /**
   * Check if customer is active
   */
  isActive(): boolean {
    return this.status === "active";
  }

  /**
   * Validate customer data
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push("Name is required");
    }

    if (!this.email || !this.email.includes("@")) {
      errors.push("Valid email is required");
    }

    if (!this.phone || this.phone.trim().length === 0) {
      errors.push("Phone is required");
    }

    if (!this.address || this.address.trim().length === 0) {
      errors.push("Address is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
