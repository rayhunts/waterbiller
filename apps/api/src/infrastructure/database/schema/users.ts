import { integer, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Users table - extended for customer management
 */
export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
  email: varchar("email").notNull().unique(),
  // Customer-specific fields
  accountNumber: varchar("account_number", { length: 50 }).unique(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  status: varchar("status", { length: 20 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
