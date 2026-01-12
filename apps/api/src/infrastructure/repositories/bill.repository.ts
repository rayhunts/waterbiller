import { eq, and, gte, lte, lt, sql, desc } from "drizzle-orm";
import { db } from "../database/connection";
import { bills } from "../database/schema/bills";
import { Bill } from "../../core/entities/bill.entity";
import type { IBillRepository } from "../../core/interfaces/repositories.interface";
import type { CreateBillDto, UpdateBillDto, BillFilters, BillStats } from "../../shared/types/common.types";

/**
 * Bill Repository Implementation
 */
export class BillRepository implements IBillRepository {
  /**
   * Convert database row to Bill entity
   */
  private toEntity(row: any): Bill {
    return new Bill(
      row.id,
      row.customerId,
      row.meterReadingId,
      row.billingPeriod,
      row.previousReading,
      row.currentReading,
      row.consumption,
      parseFloat(row.ratePerUnit || "0"),
      parseFloat(row.baseCharge || "0"),
      parseFloat(row.totalAmount),
      row.dueDate,
      row.status || "pending",
      row.createdAt || new Date(),
      row.updatedAt || new Date()
    );
  }

  async findAll(filters?: BillFilters): Promise<Bill[]> {
    let query = db.select().from(bills);

    // Apply filters
    const conditions = [];

    if (filters?.customerId) {
      conditions.push(eq(bills.customerId, filters.customerId));
    }

    if (filters?.status) {
      conditions.push(eq(bills.status, filters.status));
    }

    if (filters?.fromDate) {
      conditions.push(gte(bills.createdAt, filters.fromDate));
    }

    if (filters?.toDate) {
      conditions.push(lte(bills.createdAt, filters.toDate));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query.orderBy(desc(bills.createdAt));
    return results.map(this.toEntity);
  }

  async findById(id: string): Promise<Bill | null> {
    const [result] = await db.select().from(bills).where(eq(bills.id, id)).limit(1);

    return result ? this.toEntity(result) : null;
  }

  async findByCustomerId(customerId: number): Promise<Bill[]> {
    const results = await db
      .select()
      .from(bills)
      .where(eq(bills.customerId, customerId))
      .orderBy(desc(bills.createdAt));

    return results.map(this.toEntity);
  }

  async findOverdue(): Promise<Bill[]> {
    const now = new Date();
    const results = await db
      .select()
      .from(bills)
      .where(and(lt(bills.dueDate, now), eq(bills.status, "pending")))
      .orderBy(desc(bills.dueDate));

    return results.map(this.toEntity);
  }

  async findPendingAndOverdue(): Promise<Bill[]> {
    const results = await db
      .select()
      .from(bills)
      .where(
        and(
          sql`${bills.status} IN ('pending', 'overdue')`
        )
      )
      .orderBy(desc(bills.createdAt));

    return results.map(this.toEntity);
  }

  async create(data: CreateBillDto): Promise<Bill> {
    const [newBill] = await db
      .insert(bills)
      .values({
        customerId: data.customerId,
        meterReadingId: data.meterReadingId,
        billingPeriod: data.billingPeriod,
        previousReading: data.previousReading,
        currentReading: data.currentReading,
        consumption: data.consumption,
        ratePerUnit: data.ratePerUnit.toString(),
        baseCharge: data.baseCharge.toString(),
        totalAmount: data.totalAmount.toString(),
        dueDate: data.dueDate,
        status: "pending",
      })
      .returning();

    return this.toEntity(newBill);
  }

  async update(id: string, data: UpdateBillDto): Promise<Bill> {
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    // Convert totalAmount to string if provided
    if (data.totalAmount !== undefined) {
      updateData.totalAmount = data.totalAmount.toString();
    }

    const [updated] = await db.update(bills).set(updateData).where(eq(bills.id, id)).returning();

    return this.toEntity(updated);
  }

  async getStats(): Promise<BillStats> {
    const allBills = await db.select().from(bills);

    const stats: BillStats = {
      totalBills: allBills.length,
      totalRevenue: 0,
      pendingBills: 0,
      pendingAmount: 0,
      overdueBills: 0,
      overdueAmount: 0,
      paidBills: 0,
      paidAmount: 0,
    };

    for (const bill of allBills) {
      const amount = parseFloat(bill.totalAmount);
      stats.totalRevenue += amount;

      if (bill.status === "pending") {
        stats.pendingBills++;
        stats.pendingAmount += amount;
      } else if (bill.status === "overdue") {
        stats.overdueBills++;
        stats.overdueAmount += amount;
      } else if (bill.status === "paid") {
        stats.paidBills++;
        stats.paidAmount += amount;
      }
    }

    return stats;
  }
}

export const billRepository = new BillRepository();
