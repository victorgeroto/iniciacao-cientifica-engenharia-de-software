/**
 * Os mesmos 8 casos de comportamento das outras versões.
 * Em camadas, o service recebe o repositório pelo construtor: basta um objeto
 * falso com a mesma forma da classe concreta (sem interface explícita).
 */
import bcrypt from "bcryptjs";
import { describe, expect, it } from "vitest";
import type { Task } from "../src/models/Task";
import type { TaskRepository } from "../src/repositories/TaskRepository";
import type { UserRepository } from "../src/repositories/UserRepository";
import { AuthService } from "../src/services/AuthService";
import { TaskService } from "../src/services/TaskService";

function fakeTaskRepo() {
  const rows: Array<Task & { userId: number }> = [];
  let seq = 0;
  const strip = ({ userId: _u, ...t }: Task & { userId: number }) => t;
  const repo = {
    async findAllByUser(userId: number) {
      return rows.filter((r) => r.userId === userId).map(strip);
    },
    async findById(id: number, userId: number) {
      const r = rows.find((x) => x.id === id && x.userId === userId);
      return r ? strip(r) : null;
    },
    async create(userId: number, t: Omit<Task, "id" | "createdAt" | "updatedAt">) {
      const r = { ...t, id: ++seq, userId, createdAt: new Date(), updatedAt: new Date() };
      rows.push(r);
      return strip(r);
    },
    async update(id: number, userId: number, t: Partial<Task>) {
      const r = rows.find((x) => x.id === id && x.userId === userId)!;
      Object.assign(r, t, { updatedAt: new Date() });
      return strip(r);
    },
    async delete(id: number, userId: number) {
      const i = rows.findIndex((x) => x.id === id && x.userId === userId);
      if (i < 0) return false;
      rows.splice(i, 1);
      return true;
    },
  };
  return repo as unknown as TaskRepository;
}

function fakeUserRepo(seed: Array<{ id: number; name: string; email: string; passwordHash: string }> = []) {
  const users = [...seed];
  return {
    async findByEmail(email: string) {
      return users.find((u) => u.email === email) ?? null;
    },
    async create(name: string, email: string, passwordHash: string) {
      const u = { id: users.length + 1, name, email, passwordHash };
      users.push(u);
      return { id: u.id, name, email };
    },
  } as unknown as UserRepository;
}

describe("camadas — tarefas", () => {
  it("cria tarefa com status e prioridade padrão", async () => {
    const t = await new TaskService(fakeTaskRepo()).create(1, { title: "Tarefa" });
    expect(t).toMatchObject({ title: "Tarefa", status: "todo", priority: "medium" });
  });

  it("rejeita título vazio", async () => {
    await expect(new TaskService(fakeTaskRepo()).create(1, { title: "  " })).rejects.toMatchObject({ status: 400 });
  });

  it("lista apenas as tarefas do usuário autenticado", async () => {
    const s = new TaskService(fakeTaskRepo());
    await s.create(1, { title: "Minha" });
    await s.create(2, { title: "De outro" });
    expect(await s.list(1)).toHaveLength(1);
  });

  it("retorna 404 para tarefa inexistente", async () => {
    await expect(new TaskService(fakeTaskRepo()).get(1, "99")).rejects.toMatchObject({ status: 404 });
  });

  it("atualiza parcialmente preservando os demais campos", async () => {
    const s = new TaskService(fakeTaskRepo());
    const t = await s.create(1, { title: "Antigo", priority: "high" });
    const u = await s.update(1, String(t.id), { status: "done" });
    expect(u).toMatchObject({ title: "Antigo", priority: "high", status: "done" });
  });

  it("remove tarefa e devolve 404 se ela não existir", async () => {
    const s = new TaskService(fakeTaskRepo());
    const t = await s.create(1, { title: "Remover" });
    await s.remove(1, String(t.id));
    await expect(s.remove(1, String(t.id))).rejects.toMatchObject({ status: 404 });
  });
});

describe("camadas — autenticação", () => {
  it("registra usuário e impede e-mail duplicado", async () => {
    const s = new AuthService(fakeUserRepo());
    const body = { name: "Ana", email: "ana@x.com", password: "123456" };
    expect((await s.register(body)).token).toBeTypeOf("string");
    await expect(s.register(body)).rejects.toMatchObject({ status: 409 });
  });

  it("recusa login com senha errada e token inválido", async () => {
    const hash = bcrypt.hashSync("certa", 4);
    const s = new AuthService(fakeUserRepo([{ id: 1, name: "Ana", email: "ana@x.com", passwordHash: hash }]));
    await expect(s.login({ email: "ana@x.com", password: "errada" })).rejects.toMatchObject({ status: 401 });
    expect(() => s.verify("token-invalido")).toThrow();
  });
});
