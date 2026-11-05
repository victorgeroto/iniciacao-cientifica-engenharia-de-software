/**
 * API A — Arquitetura Monolítica.
 *
 * Rotas, validação, autenticação, regras de negócio e acesso ao banco convivem neste
 * único arquivo, com acoplamento direto entre as partes. É a linha de base (baseline)
 * do comparativo.
 */
import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { MetricsRegistry, mountMetricsEndpoints } from "@proto/shared";

const ARCHITECTURE = "monolito";
const PORT = Number(process.env.PORT ?? 3001);
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-trocar";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? "postgres://proto:proto@localhost:5433/monolito",
  max: 10,
});

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

const registerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(6).max(100),
});
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});
const taskCreateSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(1000).default(""),
  status: z.enum(["todo", "doing", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});
const taskUpdateSchema = taskCreateSchema.partial();

const TASK_COLUMNS =
  "id, title, description, status, priority, created_at AS \"createdAt\", updated_at AS \"updatedAt\"";

export const app = express();
const metrics = new MetricsRegistry(ARCHITECTURE);
app.use(metrics.middleware());
app.use(express.json());
mountMetricsEndpoints(app, metrics, ARCHITECTURE);

function sign(user: { id: number; email: string }) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "8h" });
}

function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as { sub: number };
    (req as Request & { userId: number }).userId = Number(payload.sub);
    next();
  } catch {
    res.status(401).json({ error: "Token ausente ou inválido" });
  }
}

app.post("/auth/register", async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos", details: parsed.error.issues });
    const { name, email, password } = parsed.data;
    const exists = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);
    if (exists.rowCount) return res.status(409).json({ error: "E-mail já cadastrado" });
    const hash = await bcrypt.hash(password, 8);
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hash],
    );
    res.status(201).json({ token: sign(rows[0]), user: rows[0] });
  } catch (err) {
    next(err);
  }
});

app.post("/auth/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos", details: parsed.error.issues });
    const { rows } = await pool.query("SELECT id, name, email, password_hash FROM users WHERE email = $1", [
      parsed.data.email,
    ]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password_hash))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
});

app.get("/tasks", auth, async (req, res, next) => {
  try {
    const userId = (req as Request & { userId: number }).userId;
    const { rows } = await pool.query(
      `SELECT ${TASK_COLUMNS} FROM tasks WHERE user_id = $1 ORDER BY created_at DESC, id DESC`,
      [userId],
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.get("/tasks/:id", auth, async (req, res, next) => {
  try {
    const userId = (req as Request & { userId: number }).userId;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "Id inválido" });
    const { rows } = await pool.query(`SELECT ${TASK_COLUMNS} FROM tasks WHERE id = $1 AND user_id = $2`, [
      id,
      userId,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Tarefa não encontrada" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post("/tasks", auth, async (req, res, next) => {
  try {
    const userId = (req as Request & { userId: number }).userId;
    const parsed = taskCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos", details: parsed.error.issues });
    const t = parsed.data;
    const { rows } = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5)
       RETURNING ${TASK_COLUMNS}`,
      [userId, t.title, t.description, t.status, t.priority],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

app.put("/tasks/:id", auth, async (req, res, next) => {
  try {
    const userId = (req as Request & { userId: number }).userId;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "Id inválido" });
    const parsed = taskUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos", details: parsed.error.issues });
    const current = await pool.query(`SELECT ${TASK_COLUMNS} FROM tasks WHERE id = $1 AND user_id = $2`, [
      id,
      userId,
    ]);
    if (!current.rows[0]) return res.status(404).json({ error: "Tarefa não encontrada" });
    const merged = { ...current.rows[0], ...parsed.data };
    const { rows } = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6 RETURNING ${TASK_COLUMNS}`,
      [merged.title, merged.description, merged.status, merged.priority, id, userId],
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

app.delete("/tasks/:id", auth, async (req, res, next) => {
  try {
    const userId = (req as Request & { userId: number }).userId;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "Id inválido" });
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [id, userId]);
    if (!result.rowCount) return res.status(404).json({ error: "Tarefa não encontrada" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[${ARCHITECTURE}]`, err);
  res.status(500).json({ error: "Erro interno" });
});

export async function start() {
  for (let attempt = 1; ; attempt++) {
    try {
      await pool.query(SCHEMA);
      break;
    } catch (err) {
      if (attempt >= 30) throw err;
      console.log(`[${ARCHITECTURE}] aguardando banco (${attempt}/30)...`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return app.listen(PORT, () => console.log(`[${ARCHITECTURE}] ouvindo na porta ${PORT}`));
}

export { pool };

if (require.main === module) {
  start().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
