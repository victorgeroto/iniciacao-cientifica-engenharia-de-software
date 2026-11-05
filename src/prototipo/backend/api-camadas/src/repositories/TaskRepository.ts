import { pool } from "../config/database";
import { Task, TaskCreateInput } from "../models/Task";

const COLUMNS =
  'id, title, description, status, priority, created_at AS "createdAt", updated_at AS "updatedAt"';

export class TaskRepository {
  async findAllByUser(userId: number): Promise<Task[]> {
    const { rows } = await pool.query(
      `SELECT ${COLUMNS} FROM tasks WHERE user_id = $1 ORDER BY created_at DESC, id DESC`,
      [userId],
    );
    return rows;
  }

  async findById(id: number, userId: number): Promise<Task | null> {
    const { rows } = await pool.query(`SELECT ${COLUMNS} FROM tasks WHERE id = $1 AND user_id = $2`, [id, userId]);
    return rows[0] ?? null;
  }

  async create(userId: number, t: Required<TaskCreateInput>): Promise<Task> {
    const { rows } = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLUMNS}`,
      [userId, t.title, t.description, t.status, t.priority],
    );
    return rows[0];
  }

  async update(id: number, userId: number, t: Required<TaskCreateInput>): Promise<Task> {
    const { rows } = await pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6 RETURNING ${COLUMNS}`,
      [t.title, t.description, t.status, t.priority, id, userId],
    );
    return rows[0];
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}
