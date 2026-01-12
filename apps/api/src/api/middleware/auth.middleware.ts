import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { appConfig } from "../../shared/config/app.config";

/**
 * JWT Authentication Middleware
 */
export const authMiddleware = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: appConfig.jwt.secret,
    })
  )
  .derive(async ({ jwt, headers, set }) => {
    const authorization = headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Unauthorized - No token provided");
    }

    const token = authorization.slice(7);
    const payload = await jwt.verify(token);

    if (!payload) {
      set.status = 401;
      throw new Error("Unauthorized - Invalid token");
    }

    return {
      user: payload as { id: number; email: string; username: string },
    };
  });
