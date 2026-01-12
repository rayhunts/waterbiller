import type { IBillRepository, IReadingRepository } from "../interfaces/repositories.interface";
import { Bill } from "../entities/bill.entity";
import { BillingCalculator } from "../../shared/utils/calculation.utils";
import { DateUtils } from "../../shared/utils/date.utils";
import type { BillFilters, DashboardStats, BillStats } from "../../shared/types/common.types";

/**
 * Billing Service - handles bill generation and management
 */
export class BillingService {
  constructor(
    private billRepository: IBillRepository,
    private readingRepository: IReadingRepository
  ) {}

  async generateBillFromReading(readingId: string): Promise<Bill> {
    // Get the reading
    const reading = await this.readingRepository.findById(readingId);
    if (!reading) {
      throw new Error("Reading not found");
    }

    // Calculate bill amount
    const calculation = BillingCalculator.calculateBillAmount(reading.consumption);

    // Create bill
    const billingPeriod = DateUtils.formatBillingPeriod(reading.readingDate);
    const dueDate = DateUtils.calculateDueDate(reading.readingDate);

    const bill = await this.billRepository.create({
      customerId: reading.customerId,
      meterReadingId: reading.id,
      billingPeriod,
      previousReading: reading.previousReading,
      currentReading: reading.currentReading,
      consumption: reading.consumption,
      ratePerUnit: calculation.breakdown[0]?.rate || 0,
      baseCharge: calculation.baseCharge,
      totalAmount: calculation.total,
      dueDate,
    });

    return bill;
  }

  async getAllBills(filters?: BillFilters): Promise<Bill[]> {
    return await this.billRepository.findAll(filters);
  }

  async getBillById(id: string): Promise<Bill> {
    const bill = await this.billRepository.findById(id);
    if (!bill) {
      throw new Error("Bill not found");
    }
    return bill;
  }

  async getOverdueBills(): Promise<Bill[]> {
    return await this.billRepository.findOverdue();
  }

  async cancelBill(id: string): Promise<void> {
    const bill = await this.getBillById(id);
    if (!bill.canBeCancelled()) {
      throw new Error("Bill cannot be cancelled");
    }

    bill.cancel();
    await this.billRepository.update(id, { status: bill.status });
  }

  async markBillsAsOverdue(): Promise<void> {
    const pendingBills = await this.billRepository.findPendingAndOverdue();

    for (const bill of pendingBills) {
      if (bill.isOverdue() && bill.status === "pending") {
        bill.markAsOverdue();
        await this.billRepository.update(bill.id, { status: "overdue" });
      }
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const billStats = await this.billRepository.getStats();

    // Get customer and meter counts (simplified for now)
    const dashboardStats: DashboardStats = {
      totalCustomers: 0,
      activeCustomers: 0,
      totalMeters: 0,
      activeMeters: 0,
      revenueThisMonth: billStats.paidAmount,
      billStats,
      recentPayments: 0,
    };

    return dashboardStats;
  }
}
