import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth.middleware";
import { schemas } from "../validators/schemas";
import { MeterHandler } from "../handlers/meter.handler";

export const metersRoutes = new Elysia({ prefix: "/meters" })
  .use(authMiddleware)
  .get("/", async ({ set }) => {
    try {
      return await MeterHandler.getAll();
    } catch (error: any) {
      set.status = 500;
      return { error: error.message, status: 500 };
    }
  }, {
    detail: {
      tags: ["Meters"],
      summary: "List all meters",
      description: "Retrieve a list of all water meters in the system",
    },
  })
  .get("/:id", async ({ params, set }) => {
    try {
      return await MeterHandler.getById(params.id);
    } catch (error: any) {
      set.status = 404;
      return { error: error.message, status: 404 };
    }
  }, {
    detail: {
      tags: ["Meters"],
      summary: "Get meter by ID",
      description: "Retrieve detailed information about a specific meter",
    },
  })
  .post("/", async ({ body, set }) => {
    try {
      const data = body as any;
      return await MeterHandler.create({
        ...data,
        installationDate: new Date(data.installationDate),
      });
    } catch (error: any) {
      set.status = 400;
      return { error: error.message, status: 400 };
    }
  }, {
    body: schemas.meter.create,
    detail: {
      tags: ["Meters"],
      summary: "Create new meter",
      description: "Register a new water meter in the system",
    },
  })
  .put("/:id", async ({ params, body, set }) => {
    try {
      return await MeterHandler.update(params.id, body as any);
    } catch (error: any) {
      set.status = 400;
      return { error: error.message, status: 400 };
    }
  }, {
    body: schemas.meter.update,
    detail: {
      tags: ["Meters"],
      summary: "Update meter",
      description: "Update an existing meter's information",
    },
  })
  .post("/:id/assign", async ({ params, body, set }) => {
    try {
      const { customerId } = body as any;
      return await MeterHandler.assign(params.id, customerId);
    } catch (error: any) {
      set.status = 400;
      return { error: error.message, status: 400 };
    }
  }, {
    body: schemas.meter.assign,
    detail: {
      tags: ["Meters"],
      summary: "Assign meter to customer",
      description: "Assign a meter to a specific customer",
    },
  })
  .get("/:id/readings", async ({ params, set }) => {
    try {
      return await MeterHandler.getReadings(params.id);
    } catch (error: any) {
      set.status = 500;
      return { error: error.message, status: 500 };
    }
  }, {
    detail: {
      tags: ["Meters"],
      summary: "Get meter readings",
      description: "Retrieve all readings for a specific meter",
    },
  });
