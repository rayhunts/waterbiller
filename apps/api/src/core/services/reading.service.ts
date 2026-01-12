import type { IReadingRepository, IMeterRepository } from "../interfaces/repositories.interface";
import { MeterReading } from "../entities/meter-reading.entity";

/**
 * Reading Service
 * Handles business logic for meter reading management
 */
export class ReadingService {
  constructor(
    private readingRepository: IReadingRepository,
    private meterRepository: IMeterRepository
  ) {}

  /**
   * Record a new meter reading
   */
  async recordReading(data: {
    meterId: string;
    currentReading: number;
    readingDate: Date;
    imageUrl?: string;
    notes?: string;
  }): Promise<MeterReading> {
    // Validate meter exists
    const meter = await this.meterRepository.findById(data.meterId);
    if (!meter) {
      throw new Error("Meter not found");
    }

    if (!meter.customerId) {
      throw new Error("Meter is not assigned to any customer");
    }

    // Get previous reading
    const previousReadings = await this.readingRepository.findByMeterId(data.meterId);
    const previousReading = previousReadings.length > 0
      ? previousReadings[0].currentReading
      : 0;

    // Business rule: Current reading must be >= previous reading
    if (data.currentReading < previousReading) {
      throw new Error(
        `Current reading (${data.currentReading}) cannot be less than previous reading (${previousReading})`
      );
    }

    // Calculate consumption
    const consumption = data.currentReading - previousReading;

    // Create reading entity
    const reading = new MeterReading(
      crypto.randomUUID(),
      data.meterId,
      meter.customerId,
      data.readingDate,
      previousReading,
      data.currentReading,
      consumption,
      data.imageUrl,
      data.notes
    );

    return await this.readingRepository.create({
      meterId: reading.meterId,
      customerId: reading.customerId,
      readingDate: reading.readingDate,
      previousReading: reading.previousReading,
      currentReading: reading.currentReading,
      consumption: reading.consumption,
      imageUrl: reading.imageUrl,
      notes: reading.notes,
    });
  }

  /**
   * Bulk import readings
   */
  async bulkImportReadings(
    readings: Array<{
      meterId: string;
      currentReading: number;
      readingDate: Date;
      imageUrl?: string;
      notes?: string;
    }>
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const reading of readings) {
      try {
        await this.recordReading(reading);
        success++;
      } catch (error: any) {
        failed++;
        errors.push(`Meter ${reading.meterId}: ${error.message}`);
      }
    }

    return { success, failed, errors };
  }

  /**
   * Get reading by ID
   */
  async getReadingById(readingId: string): Promise<MeterReading | null> {
    return await this.readingRepository.findById(readingId);
  }

  /**
   * Get all readings
   */
  async getAllReadings(): Promise<MeterReading[]> {
    return await this.readingRepository.findAll();
  }

  /**
   * Get readings by meter ID
   */
  async getReadingsByMeterId(meterId: string): Promise<MeterReading[]> {
    return await this.readingRepository.findByMeterId(meterId);
  }

  /**
   * Get readings by customer ID
   */
  async getReadingsByCustomerId(customerId: number): Promise<MeterReading[]> {
    return await this.readingRepository.findByCustomerId(customerId);
  }
}
