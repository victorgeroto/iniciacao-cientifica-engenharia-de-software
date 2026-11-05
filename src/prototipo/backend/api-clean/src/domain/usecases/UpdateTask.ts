import type { Task, TaskChanges } from "../entities/Task";
import { NotFoundError } from "../errors/DomainErrors";
import type { TaskRepository } from "../ports";
import { assertId } from "./assertId";

export class UpdateTask {
  constructor(private readonly tasks: TaskRepository) {}

  async execute(userId: number, id: number, changes: TaskChanges): Promise<Task> {
    assertId(id);
    const current = await this.tasks.findById(id, userId);
    if (!current) throw new NotFoundError();
    return this.tasks.save(current.withChanges(changes));
  }
}
