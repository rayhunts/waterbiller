/**
 * Service instances with dependency injection
 */
import { BillingService } from "./billing.service";
import { CustomerService } from "./customer.service";
import { MeterService } from "./meter.service";
import { ReadingService } from "./reading.service";
import { PaymentService } from "./payment.service";

import { billRepository } from "../../infrastructure/repositories/bill.repository";
import { readingRepository } from "../../infrastructure/repositories/reading.repository";
import { customerRepository } from "../../infrastructure/repositories/customer.repository";
import { meterRepository } from "../../infrastructure/repositories/meter.repository";
import { paymentRepository } from "../../infrastructure/repositories/payment.repository";

// Instantiate services with dependencies
export const billingService = new BillingService(billRepository, readingRepository);
export const customerService = new CustomerService(customerRepository);
export const meterService = new MeterService(meterRepository);
export const readingService = new ReadingService(readingRepository, meterRepository);
export const paymentService = new PaymentService(paymentRepository, billRepository);

// Export repositories for direct use in simpler handlers
export {
  customerRepository,
  meterRepository,
  readingRepository,
  billRepository,
  paymentRepository,
};
