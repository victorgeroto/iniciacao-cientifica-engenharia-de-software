import type { Task } from "../entities/Task";
import type { TaskRepository } from "../ports";

export class ListTasks {
  constructor(private readonly tasks: TaskRepository) {}

  execute(userId: number): Promise<Task[]> {
    return this.tasks.listByUser(userId);
  }
}
