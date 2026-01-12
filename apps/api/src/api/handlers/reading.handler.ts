import { readingService } from "../../core/services";

/**
 * Reading Handler
 * Handles meter reading-related HTTP requests
 */
export class ReadingHandler {
  /**
   * Get all readings
   */
  static async getAll() {
    return await readingService.getAllReadings();
  }

  /**
   * Get reading by ID
   */
  static async getById(id: string) {
    const reading = await readingService.getReadingById(id);
    if (!reading) {
      throw new Error("Reading not found");
    }
    return reading;
  }

  /**
   * Record single reading
   */
  static async create(data: {
    meterId: string;
    currentReading: number;
    readingDate: Date;
    imageUrl?: string;
    notes?: string;
  }) {
    return await readingService.recordReading(data);
  }

  /**
   * Bulk import readings
   */
  static async bulkImport(
    readings: Array<{
      meterId: string;
      currentReading: number;
      readingDate: Date;
      imageUrl?: string;
      notes?: string;
    }>
  ) {
    return await readingService.bulkImportReadings(readings);
  }

  /**
   * Get readings by customer
   */
  static async getByCustomer(customerId: number) {
    return await readingService.getReadingsByCustomerId(customerId);
  }
}
