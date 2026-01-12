import bcrypt from "bcrypt";
import { customerRepository } from "../../core/services";

/**
 * Auth Handler
 * Handles authentication-related HTTP requests
 */
export class AuthHandler {
  /**
   * Handle user login
   */
  static async login(body: { email: string; password: string }, jwt: any) {
    // Find user by email (users are customers)
    const customer = await customerRepository.findByEmail(body.email);

    if (!customer) {
      throw new Error("Invalid email or password");
    }

    // Get user with password for verification
    const { users } = await import("../../infrastructure/database/schema/users");
    const { db } = await import("../../infrastructure/database/connection");
    const { eq } = await import("drizzle-orm");

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = await jwt.sign({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        accountNumber: user.accountNumber,
      },
    };
  }

  /**
   * Get current user information
   */
  static async getCurrentUser(userId: number) {
    const customer = await customerRepository.findById(userId);

    if (!customer) {
      throw new Error("User not found");
    }

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      username: customer.username,
      accountNumber: customer.accountNumber,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
    };
  }
}
