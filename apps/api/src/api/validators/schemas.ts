import { t } from "elysia";

/**
 * TypeBox validation schemas for API endpoints
 */
export const schemas = {
  auth: {
    login: t.Object({
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 6 }),
    }),
  },
  customer: {
    create: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
      username: t.String({ minLength: 3 }),
      password: t.String({ minLength: 6 }),
      phone: t.String(),
      address: t.String(),
    }),
    update: t.Object({
      name: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      address: t.Optional(t.String()),
      status: t.Optional(t.Union([t.Literal("active"), t.Literal("inactive")])),
    }),
  },
  meter: {
    create: t.Object({
      meterNumber: t.String(),
      location: t.String(),
      installationDate: t.String(), // ISO date string
    }),
    update: t.Object({
      location: t.Optional(t.String()),
      status: t.Optional(t.Union([t.Literal("active"), t.Literal("inactive")])),
    }),
    assign: t.Object({
      customerId: t.Number(),
    }),
  },
  reading: {
    create: t.Object({
      meterId: t.String(),
      currentReading: t.Number({ minimum: 0 }),
      readingDate: t.String(), // ISO date string
      imageUrl: t.Optional(t.String()),
      notes: t.Optional(t.String()),
    }),
    bulk: t.Array(
      t.Object({
        meterId: t.String(),
        currentReading: t.Number({ minimum: 0 }),
        readingDate: t.String(),
      })
    ),
  },
  bill: {
    generate: t.Object({
      readingId: t.String(),
    }),
  },
  payment: {
    create: t.Object({
      billId: t.String(),
      amount: t.Number({ minimum: 0 }),
      paymentMethod: t.Union([
        t.Literal("cash"),
        t.Literal("card"),
        t.Literal("bank_transfer"),
        t.Literal("mobile_money"),
      ]),
      transactionReference: t.String(),
    }),
  },
};
