/**
 * Os mesmos 8 casos de comportamento das outras versões.
 * No monólito não há ponto de injeção: a única forma de isolar o banco é
 * interceptar pool.query e roteirizar as respostas SQL de cada chamada.
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { app, pool } from "../src/server";

const token = jwt.sign({ sub: 1, email: "a@a.com" }, "dev-secret-trocar");
const auth = { Authorization: `Bearer ${token}` };
const row = (over: Record<string, unknown> = {}) => ({
  id: 1,
  title: "Tarefa",
  description: "",
  status: "todo",
  priority: "medium",
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
  ...over,
});

function scriptQueries(...results: Array<{ rows?: unknown[]; rowCount?: number }>) {
  const spy = vi.spyOn(pool, "query") as unknown as ReturnType<typeof vi.fn>;
  for (const r of results) spy.mockResolvedValueOnce({ rows: r.rows ?? [], rowCount: r.rowCount ?? (r.rows ?? []).length });
  return spy;
}

afterEach(() => vi.restoreAllMocks());

describe("monólito — tarefas", () => {
  it("cria tarefa com status e prioridade padrão", async () => {
    const spy = scriptQueries({ rows: [row()] });
    const res = await request(app).post("/tasks").set(auth).send({ title: "Tarefa" });
    expect(res.status).toBe(201);
    expect(spy.mock.calls[0][1]).toEqual([1, "Tarefa", "", "todo", "medium"]);
  });

  it("rejeita título vazio", async () => {
    const res = await request(app).post("/tasks").set(auth).send({ title: "  " });
    expect(res.status).toBe(400);
  });

  it("lista apenas as tarefas do usuário autenticado", async () => {
    const spy = scriptQueries({ rows: [row(), row({ id: 2 })] });
    const res = await request(app).get("/tasks").set(auth);
    expect(res.body).toHaveLength(2);
    expect(spy.mock.calls[0][1]).toEqual([1]);
  });

  it("retorna 404 para tarefa inexistente", async () => {
    scriptQueries({ rows: [] });
    const res = await request(app).get("/tasks/99").set(auth);
    expect(res.status).toBe(404);
  });

  it("atualiza parcialmente preservando os demais campos", async () => {
    const spy = scriptQueries({ rows: [row({ title: "Antigo", priority: "high" })] }, { rows: [row({ status: "done" })] });
    const res = await request(app).put("/tasks/1").set(auth).send({ status: "done" });
    expect(res.status).toBe(200);
    expect(spy.mock.calls[1][1]).toEqual(["Antigo", "", "done", "high", 1, 1]);
  });

  it("remove tarefa e devolve 404 se ela não existir", async () => {
    scriptQueries({ rowCount: 1 }, { rowCount: 0 });
    expect((await request(app).delete("/tasks/1").set(auth)).status).toBe(204);
    expect((await request(app).delete("/tasks/1").set(auth)).status).toBe(404);
  });
});

describe("monólito — autenticação", () => {
  it("registra usuário e impede e-mail duplicado", async () => {
    scriptQueries({ rows: [] }, { rows: [{ id: 1, name: "Ana", email: "ana@x.com" }] }, { rows: [{}], rowCount: 1 });
    const body = { name: "Ana", email: "ana@x.com", password: "123456" };
    const first = await request(app).post("/auth/register").send(body);
    expect(first.status).toBe(201);
    expect(first.body.token).toBeTypeOf("string");
    expect((await request(app).post("/auth/register").send(body)).status).toBe(409);
  });

  it("recusa login com senha errada e token ausente", async () => {
    const hash = bcrypt.hashSync("certa", 4);
    scriptQueries({ rows: [{ id: 1, name: "Ana", email: "ana@x.com", password_hash: hash }] });
    expect((await request(app).post("/auth/login").send({ email: "ana@x.com", password: "errada" })).status).toBe(401);
    expect((await request(app).get("/tasks")).status).toBe(401);
  });
});
