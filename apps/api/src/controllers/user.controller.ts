import { Elysia, t } from "elysia";
import { userRepository } from "../repositories/user.repository";

export const userController = new Elysia({ prefix: "/users" })
  .get("/", async ({ set }) => {
    try {
      const users = await userRepository.findAll();
      return users;
    } catch (error) {
      set.status = 500;
      return {
        error: "Failed to fetch users",
        status: 500,
      };
    }
  }, {
    response: {
      200: t.Array(
        t.Object({
          id: t.Number(),
          name: t.String(),
          username: t.String(),
          email: t.String(),
        })
      ),
      500: t.Object({
        error: t.String(),
        status: t.Number(),
      }),
    },
  })
  .get("/:id", async ({ params, set }) => {
    try {
      const user = await userRepository.findById(params.id);

      if (!user) {
        set.status = 404;
        return {
          error: "User not found",
          status: 404,
        };
      }

      return user;
    } catch (error) {
      set.status = 500;
      return {
        error: "Failed to fetch user",
        status: 500,
      };
    }
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    response: {
      200: t.Object({
        id: t.Number(),
        name: t.String(),
        username: t.String(),
        email: t.String(),
      }),
      404: t.Object({
        error: t.String(),
        status: t.Number(),
      }),
      500: t.Object({
        error: t.String(),
        status: t.Number(),
      }),
    },
  });
