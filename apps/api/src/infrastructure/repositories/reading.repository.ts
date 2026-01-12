import { eq, desc } from "drizzle-orm";
import { db } from "../database/connection";
import { meterReadings } from "../database/schema/readings";
import { MeterReading } from "../../core/entities/meter-reading.entity";
import type { IReadingRepository } from "../../core/interfaces/repositories.interface";
import type { CreateReadingDto } from "../../shared/types/common.types";
import { BillingCalculator } from "../../shared/utils/calculation.utils";

/**
 * Reading Repository Implementation
 */
export class ReadingRepository implements IReadingRepository {
  /**
   * Convert database row to MeterReading entity
   */
  private toEntity(row: any): MeterReading {
    return new MeterReading(
      row.id,
      row.meterId,
      row.customerId,
      row.readingDate,
      row.previousReading,
      row.currentReading,
      row.consumption,
      row.imageUrl,
      row.notes,
      row.createdAt || new Date()
    );
  }

  async findAll(): Promise<MeterReading[]> {
    const results = await db
      .select()
      .from(meterReadings)
      .orderBy(desc(meterReadings.readingDate));

    return results.map(this.toEntity);
  }

  async findById(id: string): Promise<MeterReading | null> {
    const [result] = await db
      .select()
      .from(meterReadings)
      .where(eq(meterReadings.id, id))
      .limit(1);

    return result ? this.toEntity(result) : null;
  }

  async findByMeterId(meterId: string): Promise<MeterReading[]> {
    const results = await db
      .select()
      .from(meterReadings)
      .where(eq(meterReadings.meterId, meterId))
      .orderBy(desc(meterReadings.readingDate));

    return results.map(this.toEntity);
  }

  async findByCustomerId(customerId: number): Promise<MeterReading[]> {
    const results = await db
      .select()
      .from(meterReadings)
      .where(eq(meterReadings.customerId, customerId))
      .orderBy(desc(meterReadings.readingDate));

    return results.map(this.toEntity);
  }

  async getLatestByMeterId(meterId: string): Promise<MeterReading | null> {
    const [result] = await db
      .select()
      .from(meterReadings)
      .where(eq(meterReadings.meterId, meterId))
      .orderBy(desc(meterReadings.readingDate))
      .limit(1);

    return result ? this.toEntity(result) : null;
  }

  async create(data: CreateReadingDto): Promise<MeterReading> {
    // Get previous reading
    const latestReading = await this.getLatestByMeterId(data.meterId);
    const previousReading = latestReading?.currentReading || 0;

    // Calculate consumption
    const consumption = BillingCalculator.calculateConsumption(
      data.currentReading,
      previousReading
    );

    const [newReading] = await db
      .insert(meterReadings)
      .values({
        meterId: data.meterId,
        customerId: (await this.getCustomerIdForMeter(data.meterId))!,
        readingDate: data.readingDate,
        previousReading,
        currentReading: data.currentReading,
        consumption,
        imageUrl: data.imageUrl || null,
        notes: data.notes || null,
      })
      .returning();

    return this.toEntity(newReading);
  }

  async createBulk(data: CreateReadingDto[]): Promise<MeterReading[]> {
    const readings = await Promise.all(data.map((reading) => this.create(reading)));
    return readings;
  }

  /**
   * Helper method to get customer ID for a meter
   */
  private async getCustomerIdForMeter(meterId: string): Promise<number | null> {
    const { meters } = await import("../database/schema/meters");
    const [meter] = await db.select().from(meters).where(eq(meters.id, meterId)).limit(1);

    return meter?.customerId || null;
  }
}

export const readingRepository = new ReadingRepository();
