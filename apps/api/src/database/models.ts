import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";

import { table } from "./schema";
import { spreads } from "./utils";

export const db = {
  insert: spreads(
    {
      user: createInsertSchema(table.users, {
        email: t.String({ format: "email" }),
      }),
    },
    "insert"
  ),
  select: spreads(
    {
      user: table.users,
    },
    "select"
  ),
} as const;
