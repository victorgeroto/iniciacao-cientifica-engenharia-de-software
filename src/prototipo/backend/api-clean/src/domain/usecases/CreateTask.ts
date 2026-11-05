import type { Task, TaskPriority, TaskStatus } from "../entities/Task";
import type { TaskRepository } from "../ports";

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export class CreateTask {
  constructor(private readonly tasks: TaskRepository) {}

  execute(userId: number, input: CreateTaskInput): Promise<Task> {
    return this.tasks.create({ userId, ...input });
  }
}
