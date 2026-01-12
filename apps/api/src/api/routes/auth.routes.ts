import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { appConfig } from "../../shared/config/app.config";
import { schemas } from "../validators/schemas";
import { authMiddleware } from "../middleware/auth.middleware";
import { AuthHandler } from "../handlers/auth.handler";

/**
 * Authentication routes
 */
export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(jwt({ name: "jwt", secret: appConfig.jwt.secret }))
  .post(
    "/login",
    async ({ body, jwt, set }) => {
      try {
        return await AuthHandler.login(body, jwt);
      } catch (error: any) {
        set.status = 401;
        return { error: error.message, status: 401 };
      }
    },
    {
      body: schemas.auth.login,
      detail: {
        tags: ["Authentication"],
        summary: "User login",
        description: "Authenticate user with email and password, returns JWT token",
      },
    }
  )
  .use(authMiddleware)
  .get("/me", async (ctx: any) => {
    const { user, set } = ctx;
    try {
      return await AuthHandler.getCurrentUser(user.id);
    } catch (error: any) {
      set.status = 404;
      return { error: error.message, status: 404 };
    }
  }, {
    detail: {
      tags: ["Authentication"],
      summary: "Get current user",
      description: "Get authenticated user information (requires JWT token)",
    },
  });
