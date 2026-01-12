import { integer, pgTable, varchar, uuid, timestamp, decimal } from "drizzle-orm/pg-core";
import { users } from "./users";
import { bills } from "./bills";

/**
 * Payments table
 */
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  billId: uuid("bill_id")
    .notNull()
    .references(() => bills.id),
  customerId: integer("customer_id")
    .notNull()
    .references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  transactionReference: varchar("transaction_reference", { length: 100 }),
  status: varchar("status", { length: 20 }).default("success"),
  createdAt: timestamp("created_at").defaultNow(),
});
