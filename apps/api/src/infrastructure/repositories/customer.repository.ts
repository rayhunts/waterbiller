import { eq, or, ilike } from "drizzle-orm";
import { db } from "../database/connection";
import { users } from "../database/schema/users";
import { Customer } from "../../core/entities/customer.entity";
import type {
  ICustomerRepository,
} from "../../core/interfaces/repositories.interface";
import type {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "../../shared/types/common.types";
import bcrypt from "bcrypt";
import { ValidationUtils } from "../../shared/utils/validation.utils";

/**
 * Customer Repository Implementation
 */
export class CustomerRepository implements ICustomerRepository {
  /**
   * Convert database row to Customer entity
   */
  private toEntity(row: any): Customer {
    return new Customer(
      row.id,
      row.accountNumber || "",
      row.name,
      row.username,
      row.email,
      row.phone || "",
      row.address || "",
      row.status || "active",
      row.createdAt || new Date(),
      row.updatedAt || new Date()
    );
  }

  async findAll(): Promise<Customer[]> {
    const results = await db
      .select({
        id: users.id,
        accountNumber: users.accountNumber,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        address: users.address,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);

    return results.map(this.toEntity);
  }

  async findById(id: number): Promise<Customer | null> {
    const [result] = await db
      .select({
        id: users.id,
        accountNumber: users.accountNumber,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        address: users.address,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result ? this.toEntity(result) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const [result] = await db
      .select({
        id: users.id,
        accountNumber: users.accountNumber,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        address: users.address,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return result ? this.toEntity(result) : null;
  }

  async findByAccountNumber(accountNumber: string): Promise<Customer | null> {
    const [result] = await db
      .select({
        id: users.id,
        accountNumber: users.accountNumber,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        address: users.address,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.accountNumber, accountNumber))
      .limit(1);

    return result ? this.toEntity(result) : null;
  }

  async search(query: string): Promise<Customer[]> {
    const results = await db
      .select({
        id: users.id,
        accountNumber: users.accountNumber,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        address: users.address,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(
        or(
          ilike(users.name, `%${query}%`),
          ilike(users.accountNumber, `%${query}%`),
          ilike(users.phone, `%${query}%`),
          ilike(users.email, `%${query}%`)
        )
      );

    return results.map(this.toEntity);
  }

  async create(data: CreateCustomerDto): Promise<Customer> {
    // Generate account number
    const accountNumber = ValidationUtils.generateAccountNumber();

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        accountNumber,
        phone: data.phone,
        address: data.address,
        status: "active",
      })
      .returning({
        id: users.id,
        accountNumber: users.accountNumber,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        address: users.address,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return this.toEntity(newUser);
  }

  async update(id: number, data: UpdateCustomerDto): Promise<Customer> {
    const [updated] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        accountNumber: users.accountNumber,
        name: users.name,
        username: users.username,
        email: users.email,
        phone: users.phone,
        address: users.address,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return this.toEntity(updated);
  }

  async delete(id: number): Promise<void> {
    await db.update(users).set({ status: "inactive" }).where(eq(users.id, id));
  }
}

export const customerRepository = new CustomerRepository();
