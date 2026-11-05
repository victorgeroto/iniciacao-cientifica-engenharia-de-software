/**
 * Equivalência funcional: o mesmo roteiro HTTP deve produzir as mesmas respostas
 * nas três APIs. É a premissa do experimento — só a arquitetura pode variar.
 * Requer as APIs no ar (docker compose up).
 */
import { describe, expect, it } from "vitest";
import { ARCHITECTURES } from "../../src/config";

async function call(base: string, method: string, path: string, body?: unknown, token?: string) {
  const res = await fetch(base + path, {
    method,
    headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

/** Roteiro único; devolve só o que deve ser idêntico entre as versões. */
async function scenario(base: string) {
  const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@teste.local`;
  const out: Record<string, unknown> = {};
  const reg = await call(base, "POST", "/auth/register", { name: "E2E", email, password: "123456" });
  out.register = [reg.status, Object.keys(reg.body.user).sort()];
  out.duplicate = (await call(base, "POST", "/auth/register", { name: "E2E", email, password: "123456" })).status;
  out.badLogin = (await call(base, "POST", "/auth/login", { email, password: "errada" })).status;
  const login = await call(base, "POST", "/auth/login", { email, password: "123456" });
  out.login = login.status;
  const token = login.body.token as string;

  out.noToken = (await call(base, "GET", "/tasks")).status;
  out.invalid = (await call(base, "POST", "/tasks", { title: "" }, token)).status;
  const created = await call(base, "POST", "/tasks", { title: "Escrever artigo" }, token);
  out.created = [created.status, created.body.status, created.body.priority, Object.keys(created.body).sort()];
  const id = created.body.id;
  const updated = await call(base, "PUT", `/tasks/${id}`, { status: "done" }, token);
  out.updated = [updated.status, updated.body.title, updated.body.status];
  out.list = (await call(base, "GET", "/tasks", undefined, token)).body.length;
  out.badId = (await call(base, "GET", "/tasks/abc", undefined, token)).status;
  out.deleted = (await call(base, "DELETE", `/tasks/${id}`, undefined, token)).status;
  out.missing = (await call(base, "GET", `/tasks/${id}`, undefined, token)).status;
  return out;
}

describe("equivalência funcional entre as três arquiteturas", () => {
  it("produz respostas idênticas para o mesmo roteiro", async () => {
    const results = await Promise.all(ARCHITECTURES.map((a) => scenario(a.url)));
    expect(results[0]).toMatchObject({ register: [201, ["email", "id", "name"]], duplicate: 409, badLogin: 401 });
    expect(results[0].created).toEqual([
      201, "todo", "medium", ["createdAt", "description", "id", "priority", "status", "title", "updatedAt"],
    ]);
    expect(results[1]).toEqual(results[0]);
    expect(results[2]).toEqual(results[0]);
  });
});
