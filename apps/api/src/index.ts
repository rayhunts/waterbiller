import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";

// Import routes
import { authRoutes } from "./api/routes/auth.routes";
import { customersRoutes } from "./api/routes/customers.routes";
import { metersRoutes } from "./api/routes/meters.routes";
import { readingsRoutes } from "./api/routes/readings.routes";
import { billsRoutes } from "./api/routes/bills.routes";
import { paymentsRoutes } from "./api/routes/payments.routes";

/**
 * Water Billing Management API
 * Built with Clean Architecture (3-layer pattern)
 */
const app = new Elysia()
  .use(cors())
  .use(
    openapi({
      documentation: {
        info: {
          title: "Water Billing Management API",
          version: "1.0.0",
          description: "A comprehensive water billing management system with customer, meter, reading, billing, and payment management capabilities.",
        },
        tags: [
          {
            name: "Authentication",
            description: "Authentication and authorization endpoints",
          },
          {
            name: "Customers",
            description: "Customer management endpoints",
          },
          {
            name: "Meters",
            description: "Water meter management endpoints",
          },
          {
            name: "Readings",
            description: "Meter reading management endpoints",
          },
          {
            name: "Bills",
            description: "Bill generation and management endpoints",
          },
          {
            name: "Payments",
            description: "Payment processing and tracking endpoints",
          },
        ],
        servers: [
          {
            url: process.env.VERCEL_URL || "http://localhost:3000",
            description: "API Server",
          },
        ],
      },
    })
  )
  .get("/", () => ({
    message: "Water Billing Management API",
    version: "1.0.0",
    endpoints: {
      auth: "/auth",
      customers: "/customers",
      meters: "/meters",
      readings: "/readings",
      bills: "/bills",
      payments: "/payments",
    },
  }))
  // Billing routes
  .use(authRoutes)
  .use(customersRoutes)
  .use(metersRoutes)
  .use(readingsRoutes)
  .use(billsRoutes)
  .use(paymentsRoutes);

export type App = typeof app;

export default app;