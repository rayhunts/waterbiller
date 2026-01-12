import { integer, pgTable, varchar, uuid, timestamp, decimal } from "drizzle-orm/pg-core";
import { users } from "./users";
import { meterReadings } from "./readings";

/**
 * Bills table
 */
export const bills = pgTable("bills", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => users.id),
  meterReadingId: uuid("meter_reading_id").references(() => meterReadings.id),
  billingPeriod: varchar("billing_period", { length: 20 }).notNull(),
  previousReading: integer("previous_reading").notNull(),
  currentReading: integer("current_reading").notNull(),
  consumption: integer("consumption").notNull(),
  ratePerUnit: decimal("rate_per_unit", { precision: 10, scale: 2 }),
  baseCharge: decimal("base_charge", { precision: 10, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
