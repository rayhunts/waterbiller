import { eq } from "drizzle-orm";
import { db } from "../database/client";
import { table } from "../database/schema";

export class UserRepository {
  async findAll() {
    return await db
      .select({
        id: table.users.id,
        name: table.users.name,
        username: table.users.username,
        email: table.users.email,
      })
      .from(table.users);
  }

  async findById(id: number) {
    const [user] = await db
      .select({
        id: table.users.id,
        name: table.users.name,
        username: table.users.username,
        email: table.users.email,
      })
      .from(table.users)
      .where(eq(table.users.id, id))
      .limit(1);

    return user || null;
  }

  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(table.users)
      .where(eq(table.users.email, email))
      .limit(1);

    return user || null;
  }

  async create(data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) {
    const [newUser] = await db
      .insert(table.users)
      .values(data)
      .returning({
        id: table.users.id,
        name: table.users.name,
        username: table.users.username,
        email: table.users.email,
      });

    return newUser;
  }
}

export const userRepository = new UserRepository();
