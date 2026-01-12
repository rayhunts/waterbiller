/**
 * Export all database schemas
 */
export { bills } from "./bills";
export { meters } from "./meters";
export { payments } from "./payments";
export { meterReadings } from "./readings";
export { users } from "./users";

// Export all tables as a single object for convenience
import { bills } from "./bills";
import { meters } from "./meters";
import { payments } from "./payments";
import { meterReadings } from "./readings";
import { users } from "./users";

export const tables = {
  users,
  meters,
  meterReadings,
  bills,
  payments,
} as const;

export type Tables = typeof tables;
