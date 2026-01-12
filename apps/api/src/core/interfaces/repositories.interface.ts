/**
 * Repository interfaces (ports) for dependency inversion
 */

import type { Customer } from "../entities/customer.entity";
import type { Meter } from "../entities/meter.entity";
import type { MeterReading } from "../entities/meter-reading.entity";
import type { Bill } from "../entities/bill.entity";
import type { Payment } from "../entities/payment.entity";
import type {
  CreateCustomerDto,
  UpdateCustomerDto,
  CreateMeterDto,
  UpdateMeterDto,
  CreateReadingDto,
  CreateBillDto,
  UpdateBillDto,
  BillFilters,
  CreatePaymentDto,
  BillStats,
} from "../../shared/types/common.types";

/**
 * Customer Repository Interface
 */
export interface ICustomerRepository {
  findAll(): Promise<Customer[]>;
  findById(id: number): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findByAccountNumber(accountNumber: string): Promise<Customer | null>;
  search(query: string): Promise<Customer[]>;
  create(data: CreateCustomerDto): Promise<Customer>;
  update(id: number, data: UpdateCustomerDto): Promise<Customer>;
  delete(id: number): Promise<void>;
}

/**
 * Meter Repository Interface
 */
export interface IMeterRepository {
  findAll(): Promise<Meter[]>;
  findById(id: string): Promise<Meter | null>;
  findByCustomerId(customerId: number): Promise<Meter[]>;
  findByMeterNumber(meterNumber: string): Promise<Meter | null>;
  create(data: CreateMeterDto): Promise<Meter>;
  update(id: string, data: UpdateMeterDto): Promise<Meter>;
  assignToCustomer(id: string, customerId: number): Promise<Meter>;
}

/**
 * Reading Repository Interface
 */
export interface IReadingRepository {
  findAll(): Promise<MeterReading[]>;
  findById(id: string): Promise<MeterReading | null>;
  findByMeterId(meterId: string): Promise<MeterReading[]>;
  findByCustomerId(customerId: number): Promise<MeterReading[]>;
  getLatestByMeterId(meterId: string): Promise<MeterReading | null>;
  create(data: CreateReadingDto): Promise<MeterReading>;
  createBulk(data: CreateReadingDto[]): Promise<MeterReading[]>;
}

/**
 * Bill Repository Interface
 */
export interface IBillRepository {
  findAll(filters?: BillFilters): Promise<Bill[]>;
  findById(id: string): Promise<Bill | null>;
  findByCustomerId(customerId: number): Promise<Bill[]>;
  findOverdue(): Promise<Bill[]>;
  findPendingAndOverdue(): Promise<Bill[]>;
  create(data: CreateBillDto): Promise<Bill>;
  update(id: string, data: UpdateBillDto): Promise<Bill>;
  getStats(): Promise<BillStats>;
}

/**
 * Payment Repository Interface
 */
export interface IPaymentRepository {
  findAll(): Promise<Payment[]>;
  findById(id: string): Promise<Payment | null>;
  findByBillId(billId: string): Promise<Payment[]>;
  findByCustomerId(customerId: number): Promise<Payment[]>;
  getTotalByBillId(billId: string): Promise<number>;
  create(data: CreatePaymentDto): Promise<Payment>;
}
