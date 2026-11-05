import type { CreateTask } from "../../domain/usecases/CreateTask";
import type { DeleteTask } from "../../domain/usecases/DeleteTask";
import type { GetTask } from "../../domain/usecases/GetTask";
import type { ListTasks } from "../../domain/usecases/ListTasks";
import type { UpdateTask } from "../../domain/usecases/UpdateTask";
import { assertId } from "../../domain/usecases/assertId";
import type { HttpRequest, HttpResponse } from "./HttpTypes";
import { parse, taskCreateSchema, taskUpdateSchema } from "./validators";

export interface TaskUseCases {
  list: ListTasks;
  get: GetTask;
  create: CreateTask;
  update: UpdateTask;
  remove: DeleteTask;
}

export class TaskController {
  constructor(private readonly useCases: TaskUseCases) {}

  async list(req: HttpRequest): Promise<HttpResponse> {
    return { status: 200, body: await this.useCases.list.execute(req.userId!) };
  }

  async get(req: HttpRequest): Promise<HttpResponse> {
    return { status: 200, body: await this.useCases.get.execute(req.userId!, Number(req.params.id)) };
  }

  async create(req: HttpRequest): Promise<HttpResponse> {
    const input = parse(taskCreateSchema, req.body);
    return { status: 201, body: await this.useCases.create.execute(req.userId!, input) };
  }

  async update(req: HttpRequest): Promise<HttpResponse> {
    const id = Number(req.params.id);
    // Mesma ordem de validação das outras versões: id antes do corpo.
    assertId(id);
    const changes = parse(taskUpdateSchema, req.body);
    return { status: 200, body: await this.useCases.update.execute(req.userId!, id, changes) };
  }

  async remove(req: HttpRequest): Promise<HttpResponse> {
    await this.useCases.remove.execute(req.userId!, Number(req.params.id));
    return { status: 204 };
  }
}
