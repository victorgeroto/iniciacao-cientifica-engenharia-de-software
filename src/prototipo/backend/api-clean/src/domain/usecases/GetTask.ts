import type { Task } from "../entities/Task";
import { NotFoundError } from "../errors/DomainErrors";
import type { TaskRepository } from "../ports";
import { assertId } from "./assertId";

export class GetTask {
  constructor(private readonly tasks: TaskRepository) {}

  async execute(userId: number, id: number): Promise<Task> {
    assertId(id);
    const task = await this.tasks.findById(id, userId);
    if (!task) throw new NotFoundError();
    return task;
  }
}
