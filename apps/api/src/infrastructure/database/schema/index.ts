/**
 * Export all database schemas
 */
export { users } from "./users";
export { meters } from "./meters";
export { meterReadings } from "./readings";
export { bills } from "./bills";
export { payments } from "./payments";

// Export all tables as a single object for convenience
import { users } from "./users";
import { meters } from "./meters";
import { meterReadings } from "./readings";
import { bills } from "./bills";
import { payments } from "./payments";

export const tables = {
  users,
  meters,
  meterReadings,
  bills,
  payments,
} as const;

export type Tables = typeof tables;
