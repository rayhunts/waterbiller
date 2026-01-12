import { eq } from "drizzle-orm";
import { db } from "../database/connection";
import { meters } from "../database/schema/meters";
import { Meter } from "../../core/entities/meter.entity";
import type { IMeterRepository } from "../../core/interfaces/repositories.interface";
import type { CreateMeterDto, UpdateMeterDto } from "../../shared/types/common.types";

/**
 * Meter Repository Implementation
 */
export class MeterRepository implements IMeterRepository {
  /**
   * Convert database row to Meter entity
   */
  private toEntity(row: any): Meter {
    return new Meter(
      row.id,
      row.meterNumber,
      row.customerId,
      row.location || "",
      row.installationDate || new Date(),
      row.status || "active",
      row.createdAt || new Date(),
      row.updatedAt || new Date()
    );
  }

  async findAll(): Promise<Meter[]> {
    const results = await db.select().from(meters);
    return results.map(this.toEntity);
  }

  async findById(id: string): Promise<Meter | null> {
    const [result] = await db.select().from(meters).where(eq(meters.id, id)).limit(1);

    return result ? this.toEntity(result) : null;
  }

  async findByCustomerId(customerId: number): Promise<Meter[]> {
    const results = await db.select().from(meters).where(eq(meters.customerId, customerId));

    return results.map(this.toEntity);
  }

  async findByMeterNumber(meterNumber: string): Promise<Meter | null> {
    const [result] = await db
      .select()
      .from(meters)
      .where(eq(meters.meterNumber, meterNumber))
      .limit(1);

    return result ? this.toEntity(result) : null;
  }

  async create(data: CreateMeterDto): Promise<Meter> {
    const [newMeter] = await db
      .insert(meters)
      .values({
        meterNumber: data.meterNumber,
        location: data.location,
        installationDate: data.installationDate,
        status: "active",
      })
      .returning();

    return this.toEntity(newMeter);
  }

  async update(id: string, data: UpdateMeterDto): Promise<Meter> {
    const [updated] = await db
      .update(meters)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(meters.id, id))
      .returning();

    return this.toEntity(updated);
  }

  async assignToCustomer(id: string, customerId: number): Promise<Meter> {
    const [updated] = await db
      .update(meters)
      .set({
        customerId,
        updatedAt: new Date(),
      })
      .where(eq(meters.id, id))
      .returning();

    return this.toEntity(updated);
  }
}

export const meterRepository = new MeterRepository();
