import { Elysia } from "elysia";

/**
 * JWT Authentication Middleware
 * Note: This middleware expects the JWT plugin to already be installed by the parent route
 */
export const authMiddleware = new Elysia()
  .derive(async (context: any) => {
    const { jwt, headers, set } = context;
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
