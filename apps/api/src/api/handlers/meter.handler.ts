import { meterService, readingRepository } from "../../core/services";

/**
 * Meter Handler
 * Handles meter-related HTTP requests
 */
export class MeterHandler {
  /**
   * Get all meters
   */
  static async getAll() {
    return await meterService.getAllMeters();
  }

  /**
   * Get meter by ID
   */
  static async getById(id: string) {
    const meter = await meterService.getMeterById(id);
    if (!meter) {
      throw new Error("Meter not found");
    }
    return meter;
  }

  /**
   * Register new meter
   */
  static async create(data: {
    meterNumber: string;
    location: string;
    installationDate: Date;
  }) {
    return await meterService.registerMeter(data);
  }

  /**
   * Update meter
   */
  static async update(
    id: string,
    data: Partial<{
      location: string;
      status: string;
    }>
  ) {
    return await meterService.updateMeter(id, data);
  }

  /**
   * Assign meter to customer
   */
  static async assign(id: string, customerId: number) {
    return await meterService.assignMeterToCustomer(id, customerId);
  }

  /**
   * Get meter readings
   */
  static async getReadings(id: string) {
    return await readingRepository.findByMeterId(id);
  }
}
