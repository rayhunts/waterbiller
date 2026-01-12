import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth.middleware";
import { schemas } from "../validators/schemas";
import { BillHandler } from "../handlers/bill.handler";

/**
 * Bills routes
 */
export const billsRoutes = new Elysia({ prefix: "/bills" })
  .use(authMiddleware)
  .get("/", async ({ query, set }) => {
    try {
      return await BillHandler.getAll(query as any);
    } catch (error: any) {
      set.status = 500;
      return { error: error.message || "Failed to get bills", status: 500 };
    }
  }, {
    detail: {
      tags: ["Bills"],
      summary: "List all bills",
      description: "Retrieve a list of all bills with optional filtering",
    },
  })
  .get("/:id", async ({ params, set }) => {
    try {
      return await BillHandler.getById(params.id);
    } catch (error: any) {
      set.status = 404;
      return { error: error.message || "Bill not found", status: 404 };
    }
  }, {
    detail: {
      tags: ["Bills"],
      summary: "Get bill by ID",
      description: "Retrieve detailed information about a specific bill",
    },
  })
  .post(
    "/generate",
    async ({ body, set }) => {
      try {
        const { readingId } = body as any;
        return await BillHandler.generate(readingId);
      } catch (error: any) {
        set.status = 400;
        return { error: error.message || "Failed to generate bill", status: 400 };
      }
    },
    {
      body: schemas.bill.generate,
      detail: {
        tags: ["Bills"],
        summary: "Generate bill",
        description: "Generate a new bill based on a meter reading",
      },
    }
  )
  .post("/:id/cancel", async ({ params, set }) => {
    try {
      return await BillHandler.cancel(params.id);
    } catch (error: any) {
      set.status = 400;
      return { error: error.message || "Failed to cancel bill", status: 400 };
    }
  }, {
    detail: {
      tags: ["Bills"],
      summary: "Cancel bill",
      description: "Cancel an existing bill",
    },
  })
  .get("/overdue/list", async ({ set }) => {
    try {
      return await BillHandler.getOverdue();
    } catch (error: any) {
      set.status = 500;
      return { error: error.message || "Failed to get overdue bills", status: 500 };
    }
  }, {
    detail: {
      tags: ["Bills"],
      summary: "Get overdue bills",
      description: "Retrieve all bills that are past their due date",
    },
  })
  .get("/stats/dashboard", async ({ set }) => {
    try {
      return await BillHandler.getStats();
    } catch (error: any) {
      set.status = 500;
      return { error: error.message || "Failed to get stats", status: 500 };
    }
  }, {
    detail: {
      tags: ["Bills"],
      summary: "Get billing statistics",
      description: "Retrieve dashboard statistics for billing overview",
    },
  })
  .get("/customer/:customerId", async ({ params, set }) => {
    try {
      return await BillHandler.getByCustomer(parseInt(params.customerId));
    } catch (error: any) {
      set.status = 500;
      return { error: error.message || "Failed to get customer bills", status: 500 };
    }
  }, {
    detail: {
      tags: ["Bills"],
      summary: "Get customer bills",
      description: "Retrieve all bills for a specific customer",
    },
  });
