import { NotFoundError } from "../errors/DomainErrors";
import type { TaskRepository } from "../ports";
import { assertId } from "./assertId";

export class DeleteTask {
  constructor(private readonly tasks: TaskRepository) {}

  async execute(userId: number, id: number): Promise<void> {
    assertId(id);
    if (!(await this.tasks.delete(id, userId))) throw new NotFoundError();
  }
}
