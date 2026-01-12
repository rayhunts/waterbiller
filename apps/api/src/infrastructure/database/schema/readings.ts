import { integer, pgTable, varchar, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { meters } from "./meters";

/**
 * Meter readings table
 */
export const meterReadings = pgTable("meter_readings", {
  id: uuid("id").primaryKey().defaultRandom(),
  meterId: uuid("meter_id")
    .notNull()
    .references(() => meters.id),
  customerId: integer("customer_id")
    .notNull()
    .references(() => users.id),
  readingDate: timestamp("reading_date").notNull(),
  previousReading: integer("previous_reading").notNull(),
  currentReading: integer("current_reading").notNull(),
  consumption: integer("consumption").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});
