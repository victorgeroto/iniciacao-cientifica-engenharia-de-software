import { pool } from "../config/database";
import { User, UserWithPassword } from "../models/User";

export class UserRepository {
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const { rows } = await pool.query(
      'SELECT id, name, email, password_hash AS "passwordHash" FROM users WHERE email = $1',
      [email],
    );
    return rows[0] ?? null;
  }

  async create(name: string, email: string, passwordHash: string): Promise<User> {
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, passwordHash],
    );
    return rows[0];
  }
}
