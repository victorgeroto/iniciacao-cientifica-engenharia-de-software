import type { Pool } from "pg";
import { Task, TaskProps } from "../../domain/entities/Task";
import type { NewTask, TaskRepository } from "../../domain/ports";

const COLUMNS =
  'id, user_id AS "userId", title, description, status, priority, created_at AS "createdAt", updated_at AS "updatedAt"';

const toEntity = (row: TaskProps) => Task.restore(row);

export class PgTaskRepository implements TaskRepository {
  constructor(private readonly pool: Pool) {}

  async listByUser(userId: number): Promise<Task[]> {
    const { rows } = await this.pool.query(
      `SELECT ${COLUMNS} FROM tasks WHERE user_id = $1 ORDER BY created_at DESC, id DESC`,
      [userId],
    );
    return rows.map(toEntity);
  }

  async findById(id: number, userId: number): Promise<Task | null> {
    const { rows } = await this.pool.query(`SELECT ${COLUMNS} FROM tasks WHERE id = $1 AND user_id = $2`, [
      id,
      userId,
    ]);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async create(t: NewTask): Promise<Task> {
    const { rows } = await this.pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLUMNS}`,
      [t.userId, t.title, t.description, t.status, t.priority],
    );
    return toEntity(rows[0]);
  }

  async save(task: Task): Promise<Task> {
    const t = task.data;
    const { rows } = await this.pool.query(
      `UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6 RETURNING ${COLUMNS}`,
      [t.title, t.description, t.status, t.priority, t.id, t.userId],
    );
    return toEntity(rows[0]);
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await this.pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}
