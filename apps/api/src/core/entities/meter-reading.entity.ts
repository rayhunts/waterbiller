import { BillingCalculator } from "../../shared/utils/calculation.utils";

/**
 * MeterReading entity with business logic
 */
export class MeterReading {
  constructor(
    public id: string,
    public meterId: string,
    public customerId: number,
    public readingDate: Date,
    public previousReading: number,
    public currentReading: number,
    public consumption: number,
    public imageUrl: string | null,
    public notes: string | null,
    public createdAt: Date
  ) {}

  /**
   * Calculate consumption from readings
   */
  calculateConsumption(): number {
    return BillingCalculator.calculateConsumption(this.currentReading, this.previousReading);
  }

  /**
   * Validate reading (current >= previous)
   */
  validateReading(): boolean {
    return this.currentReading >= this.previousReading;
  }

  /**
   * Check if reading has an image
   */
  hasImage(): boolean {
    return this.imageUrl !== null && this.imageUrl.trim().length > 0;
  }

  /**
   * Check if reading has notes
   */
  hasNotes(): boolean {
    return this.notes !== null && this.notes.trim().length > 0;
  }

  /**
   * Validate meter reading data
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.meterId) {
      errors.push("Meter ID is required");
    }

    if (!this.customerId) {
      errors.push("Customer ID is required");
    }

    if (!this.readingDate) {
      errors.push("Reading date is required");
    }

    if (this.currentReading < 0) {
      errors.push("Current reading must be non-negative");
    }

    if (this.previousReading < 0) {
      errors.push("Previous reading must be non-negative");
    }

    if (!this.validateReading()) {
      errors.push("Current reading must be greater than or equal to previous reading");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create a new reading with calculated consumption
   */
  static create(
    id: string,
    meterId: string,
    customerId: number,
    readingDate: Date,
    previousReading: number,
    currentReading: number,
    imageUrl: string | null = null,
    notes: string | null = null
  ): MeterReading {
    const consumption = BillingCalculator.calculateConsumption(currentReading, previousReading);

    return new MeterReading(
      id,
      meterId,
      customerId,
      readingDate,
      previousReading,
      currentReading,
      consumption,
      imageUrl,
      notes,
      new Date()
    );
  }
}
