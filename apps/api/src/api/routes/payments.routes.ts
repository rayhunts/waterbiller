import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth.middleware";
import { schemas } from "../validators/schemas";
import { PaymentHandler } from "../handlers/payment.handler";

export const paymentsRoutes = new Elysia({ prefix: "/payments" })
  .use(authMiddleware)
  .get("/", async ({ set }) => {
    try {
      return await PaymentHandler.getAll();
    } catch (error: any) {
      set.status = 500;
      return { error: error.message, status: 500 };
    }
  }, {
    detail: {
      tags: ["Payments"],
      summary: "List all payments",
      description: "Retrieve a list of all payment transactions",
    },
  })
  .get("/:id", async ({ params, set }) => {
    try {
      return await PaymentHandler.getById(params.id);
    } catch (error: any) {
      set.status = 404;
      return { error: error.message, status: 404 };
    }
  }, {
    detail: {
      tags: ["Payments"],
      summary: "Get payment by ID",
      description: "Retrieve detailed information about a specific payment",
    },
  })
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const data = body as any;
        return await PaymentHandler.create(data);
      } catch (error: any) {
        set.status = 400;
        return { error: error.message, status: 400 };
      }
    },
    {
      body: schemas.payment.create,
      detail: {
        tags: ["Payments"],
        summary: "Create payment",
        description: "Record a new payment transaction for a bill",
      },
    }
  )
  .get("/customer/:customerId", async ({ params, set }) => {
    try {
      return await PaymentHandler.getByCustomer(Number.parseInt(params.customerId));
    } catch (error: any) {
      set.status = 500;
      return { error: error.message, status: 500 };
    }
  }, {
    detail: {
      tags: ["Payments"],
      summary: "Get customer payments",
      description: "Retrieve all payments made by a specific customer",
    },
  });
