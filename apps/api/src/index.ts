import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

import { db as models } from "./database/models";
import { db } from "./database/client";
import { table } from "./database/schema";

const { user } = models.insert;

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .post(
    "/sign-in",
    async ({ body, set }) => {
      try {
        const [user] = await db.select().from(table.users).where(eq(table.users.username, body.username)).limit(1);

        if (!user) {
          set.status = 400;
          return {
            error: "Invalid username or password",
            status: 400,
          };
        }

        const passwordMatch = await bcrypt.compare(body.password, user.password);

        if (!passwordMatch) {
          set.status = 400;
          return {
            error: "Invalid username or password",
            status: 400,
          };
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        };
      } catch (error) {
        set.status = 400;
        return {
          error: "Failed to sign in",
          status: 400,
        };
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
      response: {
        200: t.Object({
          id: t.Number(),
          name: t.String(),
          username: t.String(),
          email: t.String(),
        }),
        400: t.Object({
          error: t.String(),
          status: t.Number(),
        }),
      },
    }
  )
  .post(
    "/sign-up",
    async ({ body, set }) => {
      try {
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const [newUser] = await db
          .insert(table.users)
          .values({
            name: body.name,
            username: body.username,
            email: body.email,
            password: hashedPassword,
          })
          .returning({
            id: table.users.id,
            name: table.users.name,
            username: table.users.username,
            email: table.users.email,
          });

        return newUser;
      } catch (error: any) {
        set.status = 400;
        if (error.code === "23505") {
          return {
            error: "Username or email already exists",
            status: 400,
          };
        }
        return {
          error: "Failed to create user",
          status: 400,
        };
      }
    },
    {
      body: t.Object({
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      }),
      response: {
        200: t.Object({
          id: t.Number(),
          name: t.String(),
          username: t.String(),
          email: t.String(),
        }),
        400: t.Object({
          error: t.String(),
          status: t.Number(),
        }),
      },
    }
  );

export type App = typeof app;

export default app;

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(3000);
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
}
