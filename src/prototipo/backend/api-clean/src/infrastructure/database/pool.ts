import { Pool } from "pg";
import type { Logger } from "../logger/Logger";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status VARCHAR(10) NOT NULL DEFAULT 'todo',
  priority VARCHAR(10) NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
`;

export function createPool(connectionString: string): Pool {
  return new Pool({ connectionString, max: 10 });
}

export async function migrate(pool: Pool, logger: Logger): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      await pool.query(SCHEMA);
      return;
    } catch (err) {
      if (attempt >= 30) throw err;
      logger.info(`aguardando banco (${attempt}/30)...`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
