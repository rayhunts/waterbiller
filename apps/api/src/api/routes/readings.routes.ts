import { Elysia } from "elysia";
import { authMiddleware } from "../middleware/auth.middleware";
import { schemas } from "../validators/schemas";
import { ReadingHandler } from "../handlers/reading.handler";

export const readingsRoutes = new Elysia({ prefix: "/readings" })
  .use(authMiddleware)
  .get("/", async ({ set }) => {
    try {
      return await ReadingHandler.getAll();
    } catch (error: any) {
      set.status = 500;
      return { error: error.message, status: 500 };
    }
  }, {
    detail: {
      tags: ["Readings"],
      summary: "List all readings",
      description: "Retrieve a list of all meter readings",
    },
  })
  .get("/:id", async ({ params, set }) => {
    try {
      return await ReadingHandler.getById(params.id);
    } catch (error: any) {
      set.status = 404;
      return { error: error.message, status: 404 };
    }
  }, {
    detail: {
      tags: ["Readings"],
      summary: "Get reading by ID",
      description: "Retrieve detailed information about a specific reading",
    },
  })
  .post("/", async ({ body, set }) => {
    try {
      const data = body as any;
      return await ReadingHandler.create({
        ...data,
        readingDate: new Date(data.readingDate),
      });
    } catch (error: any) {
      set.status = 400;
      return { error: error.message, status: 400 };
    }
  }, {
    body: schemas.reading.create,
    detail: {
      tags: ["Readings"],
      summary: "Create new reading",
      description: "Record a new meter reading",
    },
  })
  .post("/bulk", async ({ body, set }) => {
    try {
      const data = (body as any[]).map((item) => ({
        ...item,
        readingDate: new Date(item.readingDate),
      }));
      return await ReadingHandler.bulkImport(data);
    } catch (error: any) {
      set.status = 400;
      return { error: error.message, status: 400 };
    }
  }, {
    body: schemas.reading.bulk,
    detail: {
      tags: ["Readings"],
      summary: "Bulk import readings",
      description: "Import multiple meter readings at once",
    },
  })
  .get("/customer/:customerId", async ({ params, set }) => {
    try {
      return await ReadingHandler.getByCustomer(parseInt(params.customerId));
    } catch (error: any) {
      set.status = 500;
      return { error: error.message, status: 500 };
    }
  }, {
    detail: {
      tags: ["Readings"],
      summary: "Get customer readings",
      description: "Retrieve all readings for a specific customer",
    },
  });
