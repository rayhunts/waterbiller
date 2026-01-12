import { integer, pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

/**
 * Meters table
 */
export const meters = pgTable("meters", {
  id: uuid("id").primaryKey().defaultRandom(),
  meterNumber: varchar("meter_number", { length: 50 }).notNull().unique(),
  customerId: integer("customer_id").references(() => users.id),
  location: varchar("location", { length: 255 }),
  installationDate: timestamp("installation_date"),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
