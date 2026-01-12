import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth.middleware";
import { schemas } from "../validators/schemas";
import { CustomerHandler } from "../handlers/customer.handler";

export const customersRoutes = new Elysia({ prefix: "/customers" })
  .use(authMiddleware)
  .get("/", async ({ query, set }) => {
    try {
      return await CustomerHandler.getAll(query as any);
    } catch (error: any) {
      set.status = 500;
      return { error: error.message, status: 500 };
    }
  }, {
    detail: {
      tags: ["Customers"],
      summary: "List all customers",
      description: "Retrieve a list of all customers with optional filtering",
    },
  })
  .get("/:id", async ({ params, set }) => {
    try {
      return await CustomerHandler.getById(parseInt(params.id));
    } catch (error: any) {
      set.status = 404;
      return { error: error.message, status: 404 };
    }
  }, {
    detail: {
      tags: ["Customers"],
      summary: "Get customer by ID",
      description: "Retrieve detailed information about a specific customer",
    },
  })
  .post("/", async ({ body, set }) => {
    try {
      return await CustomerHandler.create(body as any);
    } catch (error: any) {
      set.status = 400;
      return { error: error.message, status: 400 };
    }
  }, {
    body: schemas.customer.create,
    detail: {
      tags: ["Customers"],
      summary: "Create new customer",
      description: "Register a new customer in the system",
    },
  })
  .put("/:id", async ({ params, body, set }) => {
    try {
      return await CustomerHandler.update(parseInt(params.id), body as any);
    } catch (error: any) {
      set.status = 400;
      return { error: error.message, status: 400 };
    }
  }, {
    body: schemas.customer.update,
    detail: {
      tags: ["Customers"],
      summary: "Update customer",
      description: "Update an existing customer's information",
    },
  })
  .delete("/:id", async ({ params, set }) => {
    try {
      return await CustomerHandler.delete(parseInt(params.id));
    } catch (error: any) {
      set.status = 400;
      return { error: error.message, status: 400 };
    }
  }, {
    detail: {
      tags: ["Customers"],
      summary: "Delete customer",
      description: "Remove a customer from the system",
    },
  })
  .get("/:id/bills", async ({ params, set }) => {
    try {
      return await CustomerHandler.getBills(parseInt(params.id));
    } catch (error: any) {
      set.status = 500;
      return { error: error.message, status: 500 };
    }
  }, {
    detail: {
      tags: ["Customers"],
      summary: "Get customer bills",
      description: "Retrieve all bills associated with a specific customer",
    },
  })
  .get("/:id/payments", async ({ params, set }) => {
    try {
      return await CustomerHandler.getPayments(parseInt(params.id));
    } catch (error: any) {
      set.status = 500;
      return { error: error.message, status: 500 };
    }
  }, {
    detail: {
      tags: ["Customers"],
      summary: "Get customer payments",
      description: "Retrieve all payments made by a specific customer",
    },
  });
