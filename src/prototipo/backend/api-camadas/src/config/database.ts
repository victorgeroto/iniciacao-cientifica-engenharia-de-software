import { Pool } from "pg";
import { env } from "./env";

export const pool = new Pool({ connectionString: env.databaseUrl, max: 10 });

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

export async function initDatabase(): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      await pool.query(SCHEMA);
      return;
    } catch (err) {
      if (attempt >= 30) throw err;
      console.log(`[${env.architecture}] aguardando banco (${attempt}/30)...`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}
