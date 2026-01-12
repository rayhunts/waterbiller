import { eq, desc, sum } from "drizzle-orm";
import { db } from "../database/connection";
import { payments } from "../database/schema/payments";
import { Payment } from "../../core/entities/payment.entity";
import type { IPaymentRepository } from "../../core/interfaces/repositories.interface";
import type { CreatePaymentDto } from "../../shared/types/common.types";

/**
 * Payment Repository Implementation
 */
export class PaymentRepository implements IPaymentRepository {
  /**
   * Convert database row to Payment entity
   */
  private toEntity(row: any): Payment {
    return new Payment(
      row.id,
      row.billId,
      row.customerId,
      parseFloat(row.amount),
      row.paymentDate,
      row.paymentMethod,
      row.transactionReference || "",
      row.status || "success",
      row.createdAt || new Date()
    );
  }

  async findAll(): Promise<Payment[]> {
    const results = await db
      .select()
      .from(payments)
      .orderBy(desc(payments.paymentDate));

    return results.map(this.toEntity);
  }

  async findById(id: string): Promise<Payment | null> {
    const [result] = await db.select().from(payments).where(eq(payments.id, id)).limit(1);

    return result ? this.toEntity(result) : null;
  }

  async findByBillId(billId: string): Promise<Payment[]> {
    const results = await db
      .select()
      .from(payments)
      .where(eq(payments.billId, billId))
      .orderBy(desc(payments.paymentDate));

    return results.map(this.toEntity);
  }

  async findByCustomerId(customerId: number): Promise<Payment[]> {
    const results = await db
      .select()
      .from(payments)
      .where(eq(payments.customerId, customerId))
      .orderBy(desc(payments.paymentDate));

    return results.map(this.toEntity);
  }

  async getTotalByBillId(billId: string): Promise<number> {
    const result = await db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(eq(payments.billId, billId));

    return parseFloat(result[0]?.total || "0");
  }

  async create(data: CreatePaymentDto): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values({
        billId: data.billId,
        customerId: data.customerId,
        amount: data.amount.toString(),
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        transactionReference: data.transactionReference,
        status: "success",
      })
      .returning();

    return this.toEntity(newPayment);
  }
}

export const paymentRepository = new PaymentRepository();
