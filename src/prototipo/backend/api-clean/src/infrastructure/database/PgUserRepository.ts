import type { Pool } from "pg";
import type { User, UserCredentials } from "../../domain/entities/User";
import type { UserRepository } from "../../domain/ports";

export class PgUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<UserCredentials | null> {
    const { rows } = await this.pool.query(
      'SELECT id, name, email, password_hash AS "passwordHash" FROM users WHERE email = $1',
      [email],
    );
    return rows[0] ?? null;
  }

  async create(name: string, email: string, passwordHash: string): Promise<User> {
    const { rows } = await this.pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, passwordHash],
    );
    return rows[0];
  }
}
