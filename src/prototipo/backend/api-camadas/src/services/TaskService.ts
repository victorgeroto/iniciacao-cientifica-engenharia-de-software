import { HttpError } from "../models/HttpError";
import { Task, taskCreateSchema, taskUpdateSchema } from "../models/Task";
import { TaskRepository } from "../repositories/TaskRepository";

function parseId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, "Id inválido");
  return id;
}

export class TaskService {
  constructor(private readonly repository = new TaskRepository()) {}

  list(userId: number): Promise<Task[]> {
    return this.repository.findAllByUser(userId);
  }

  async get(userId: number, rawId: string): Promise<Task> {
    const task = await this.repository.findById(parseId(rawId), userId);
    if (!task) throw new HttpError(404, "Tarefa não encontrada");
    return task;
  }

  async create(userId: number, body: unknown): Promise<Task> {
    const parsed = taskCreateSchema.safeParse(body);
    if (!parsed.success) throw new HttpError(400, "Dados inválidos", parsed.error.issues);
    return this.repository.create(userId, parsed.data);
  }

  async update(userId: number, rawId: string, body: unknown): Promise<Task> {
    const id = parseId(rawId);
    const parsed = taskUpdateSchema.safeParse(body);
    if (!parsed.success) throw new HttpError(400, "Dados inválidos", parsed.error.issues);
    const current = await this.repository.findById(id, userId);
    if (!current) throw new HttpError(404, "Tarefa não encontrada");
    const merged = { ...current, ...parsed.data };
    return this.repository.update(id, userId, {
      title: merged.title,
      description: merged.description,
      status: merged.status,
      priority: merged.priority,
    });
  }

  async remove(userId: number, rawId: string): Promise<void> {
    const deleted = await this.repository.delete(parseId(rawId), userId);
    if (!deleted) throw new HttpError(404, "Tarefa não encontrada");
  }
}
