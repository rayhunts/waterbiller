/**
 * Common types and DTOs used across the application
 */

// Entity status types
export type EntityStatus = "active" | "inactive";
export type BillStatus = "pending" | "paid" | "overdue" | "cancelled";
export type PaymentStatus = "success" | "pending" | "failed";
export type PaymentMethod = "cash" | "card" | "bank_transfer" | "mobile_money";

// Customer DTOs
export interface CreateCustomerDto {
  name: string;
  email: string;
  username: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  phone?: string;
  address?: string;
  status?: EntityStatus;
}

// Meter DTOs
export interface CreateMeterDto {
  meterNumber: string;
  location: string;
  installationDate: Date;
}

export interface UpdateMeterDto {
  location?: string;
  status?: EntityStatus;
}

export interface AssignMeterDto {
  customerId: number;
}

// Reading DTOs
export interface CreateReadingDto {
  meterId: string;
  currentReading: number;
  readingDate: Date;
  imageUrl?: string;
  notes?: string;
}

// Bill DTOs
export interface CreateBillDto {
  customerId: number;
  meterReadingId: string | null;
  billingPeriod: string;
  previousReading: number;
  currentReading: number;
  consumption: number;
  ratePerUnit: number;
  baseCharge: number;
  totalAmount: number;
  dueDate: Date;
}

export interface UpdateBillDto {
  status?: BillStatus;
  totalAmount?: number;
}

export interface BillFilters {
  customerId?: number;
  status?: BillStatus;
  fromDate?: Date;
  toDate?: Date;
}

// Payment DTOs
export interface CreatePaymentDto {
  billId: string;
  customerId: number;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  transactionReference: string;
}

// Statistics and Dashboard
export interface BillStats {
  totalBills: number;
  totalRevenue: number;
  pendingBills: number;
  pendingAmount: number;
  overdueBills: number;
  overdueAmount: number;
  paidBills: number;
  paidAmount: number;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalMeters: number;
  activeMeters: number;
  revenueThisMonth: number;
  billStats: BillStats;
  recentPayments: number;
}

// Error types
export interface ApiError {
  error: string;
  status: number;
  details?: any;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface JWTPayload {
  id: number;
  email: string;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    username: string;
    accountNumber: string;
  };
}
