/**
 * Os mesmos 8 casos de comportamento das outras versões.
 * Na Clean Architecture, os casos de uso dependem só de portas: as dublês são
 * implementações em memória dessas interfaces, sem banco, bcrypt ou JWT.
 */
import { describe, expect, it } from "vitest";
import { Task } from "../src/domain/entities/Task";
import type { User, UserCredentials } from "../src/domain/entities/User";
import { ConflictError, NotFoundError, UnauthorizedError, ValidationError } from "../src/domain/errors/DomainErrors";
import type { NewTask, PasswordHasher, TaskRepository, TokenService, UserRepository } from "../src/domain/ports";
import { AuthenticateToken } from "../src/domain/usecases/AuthenticateToken";
import { CreateTask } from "../src/domain/usecases/CreateTask";
import { DeleteTask } from "../src/domain/usecases/DeleteTask";
import { GetTask } from "../src/domain/usecases/GetTask";
import { ListTasks } from "../src/domain/usecases/ListTasks";
import { LoginUser } from "../src/domain/usecases/LoginUser";
import { RegisterUser } from "../src/domain/usecases/RegisterUser";
import { UpdateTask } from "../src/domain/usecases/UpdateTask";
import { TaskController } from "../src/interfaces/controllers/TaskController";

class InMemoryTasks implements TaskRepository {
  private rows: Task[] = [];
  private seq = 0;
  async listByUser(userId: number) {
    return this.rows.filter((t) => t.belongsTo(userId));
  }
  async findById(id: number, userId: number) {
    return this.rows.find((t) => t.id === id && t.belongsTo(userId)) ?? null;
  }
  async create(t: NewTask) {
    const task = Task.restore({ ...t, id: ++this.seq, createdAt: new Date(), updatedAt: new Date() });
    this.rows.push(task);
    return task;
  }
  async save(task: Task) {
    this.rows = this.rows.map((t) => (t.id === task.id ? task : t));
    return task;
  }
  async delete(id: number, userId: number) {
    const before = this.rows.length;
    this.rows = this.rows.filter((t) => !(t.id === id && t.belongsTo(userId)));
    return this.rows.length < before;
  }
}

class InMemoryUsers implements UserRepository {
  constructor(private users: UserCredentials[] = []) {}
  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email) ?? null;
  }
  async create(name: string, email: string, passwordHash: string): Promise<User> {
    const u = { id: this.users.length + 1, name, email, passwordHash };
    this.users.push(u);
    return { id: u.id, name, email };
  }
}

const hasher: PasswordHasher = {
  hash: async (p) => `hash:${p}`,
  compare: async (p, h) => h === `hash:${p}`,
};
const tokens: TokenService = {
  sign: (u) => `token-${u.id}`,
  verify: (t) => {
    if (!t.startsWith("token-")) throw new UnauthorizedError("Token ausente ou inválido");
    return Number(t.slice(6));
  },
};

function controller(repo = new InMemoryTasks()) {
  return new TaskController({
    list: new ListTasks(repo),
    get: new GetTask(repo),
    create: new CreateTask(repo),
    update: new UpdateTask(repo),
    remove: new DeleteTask(repo),
  });
}

describe("clean — tarefas", () => {
  it("cria tarefa com status e prioridade padrão", async () => {
    const res = await controller().create({ userId: 1, params: {}, body: { title: "Tarefa" } });
    expect(res.status).toBe(201);
    expect(JSON.parse(JSON.stringify(res.body))).toMatchObject({ status: "todo", priority: "medium" });
  });

  it("rejeita título vazio", async () => {
    await expect(controller().create({ userId: 1, params: {}, body: { title: "  " } })).rejects.toBeInstanceOf(
      ValidationError,
    );
  });

  it("lista apenas as tarefas do usuário autenticado", async () => {
    const repo = new InMemoryTasks();
    await new CreateTask(repo).execute(1, { title: "Minha", description: "", status: "todo", priority: "low" });
    await new CreateTask(repo).execute(2, { title: "De outro", description: "", status: "todo", priority: "low" });
    expect(await new ListTasks(repo).execute(1)).toHaveLength(1);
  });

  it("retorna 404 para tarefa inexistente", async () => {
    await expect(new GetTask(new InMemoryTasks()).execute(1, 99)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("atualiza parcialmente preservando os demais campos", async () => {
    const repo = new InMemoryTasks();
    const t = await new CreateTask(repo).execute(1, { title: "Antigo", description: "", status: "todo", priority: "high" });
    const res = await controller(repo).update({ userId: 1, params: { id: String(t.id) }, body: { status: "done" } });
    expect(JSON.parse(JSON.stringify(res.body))).toMatchObject({ title: "Antigo", priority: "high", status: "done" });
  });

  it("remove tarefa e devolve 404 se ela não existir", async () => {
    const repo = new InMemoryTasks();
    const t = await new CreateTask(repo).execute(1, { title: "Remover", description: "", status: "todo", priority: "low" });
    await new DeleteTask(repo).execute(1, t.id);
    await expect(new DeleteTask(repo).execute(1, t.id)).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("clean — autenticação", () => {
  it("registra usuário e impede e-mail duplicado", async () => {
    const register = new RegisterUser(new InMemoryUsers(), hasher, tokens);
    const input = { name: "Ana", email: "ana@x.com", password: "123456" };
    expect((await register.execute(input)).token).toBe("token-1");
    await expect(register.execute(input)).rejects.toBeInstanceOf(ConflictError);
  });

  it("recusa login com senha errada e token inválido", async () => {
    const users = new InMemoryUsers([{ id: 1, name: "Ana", email: "ana@x.com", passwordHash: "hash:certa" }]);
    await expect(new LoginUser(users, hasher, tokens).execute({ email: "ana@x.com", password: "errada" })).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
    expect(() => new AuthenticateToken(tokens).execute("invalido")).toThrow(UnauthorizedError);
  });
});
