import type { IMeterRepository } from "../interfaces/repositories.interface";
import { Meter } from "../entities/meter.entity";

/**
 * Meter Service
 * Handles business logic for meter management
 */
export class MeterService {
  constructor(private meterRepository: IMeterRepository) {}

  /**
   * Register a new meter
   */
  async registerMeter(data: {
    meterNumber: string;
    location: string;
    installationDate: Date;
  }): Promise<Meter> {
    // Business rule: Meter number must be unique (handled by repository)
    return await this.meterRepository.create({
      ...data,
      status: "active",
    });
  }

  /**
   * Assign meter to a customer
   */
  async assignMeterToCustomer(meterId: string, customerId: number): Promise<Meter> {
    const meter = await this.meterRepository.findById(meterId);
    if (!meter) {
      throw new Error("Meter not found");
    }

    if (meter.customerId) {
      throw new Error("Meter is already assigned to a customer");
    }

    meter.assignToCustomer(customerId);
    return await this.meterRepository.update(meterId, {
      customerId: meter.customerId,
    });
  }

  /**
   * Deactivate a meter
   */
  async deactivateMeter(meterId: string): Promise<void> {
    const meter = await this.meterRepository.findById(meterId);
    if (!meter) {
      throw new Error("Meter not found");
    }

    meter.deactivate();
    await this.meterRepository.update(meterId, { status: meter.status });
  }

  /**
   * Update meter information
   */
  async updateMeter(
    meterId: string,
    data: Partial<{
      location: string;
      status: string;
    }>
  ): Promise<Meter> {
    const meter = await this.meterRepository.findById(meterId);
    if (!meter) {
      throw new Error("Meter not found");
    }

    return await this.meterRepository.update(meterId, data);
  }

  /**
   * Get meter by ID
   */
  async getMeterById(meterId: string): Promise<Meter | null> {
    return await this.meterRepository.findById(meterId);
  }

  /**
   * Get all meters
   */
  async getAllMeters(): Promise<Meter[]> {
    return await this.meterRepository.findAll();
  }

  /**
   * Get meters by customer ID
   */
  async getMetersByCustomerId(customerId: number): Promise<Meter[]> {
    return await this.meterRepository.findByCustomerId(customerId);
  }

  /**
   * Get meter reading history
   */
  async getMeterReadingHistory(meterId: string) {
    // This would typically call readingRepository through dependency injection
    // For now, this is handled directly in the route
    return [];
  }
}
