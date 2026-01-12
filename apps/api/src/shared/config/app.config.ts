/**
 * Application configuration
 */
export const appConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    expiresIn: "7d",
  },
  billing: {
    baseCharge: 5,
    dueDateDays: 30,
    tiers: [
      { max: 10, rate: 2 },
      { max: 50, rate: 3 },
      { max: Infinity, rate: 4 },
    ],
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "0.0.0.0",
  },
} as const;
