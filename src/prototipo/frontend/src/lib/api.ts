import axios, { AxiosError, AxiosInstance } from "axios";
import { ARCHITECTURES, ArchitectureId } from "./architectures";
import type { CodeMetrics, LoadTestParams, LoadTestRun, RuntimeMetrics, Task, User } from "./types";

const TOKEN_KEY = "proto.tokens";
const USER_KEY = "proto.user";

export interface RequestLogEntry {
  id: number;
  architecture: ArchitectureId;
  method: string;
  path: string;
  status: number;
  ms: number;
  at: number;
}

type Listener = (e: RequestLogEntry) => void;
const listeners = new Set<Listener>();
let seq = 0;

export function onRequest(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function loadTokens(): Partial<Record<ArchitectureId, string>> {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) ?? "{}");
  } catch {
    return {};
  }
}

let tokens = loadTokens();

/** Um cliente Axios por API; registra a latência vista pelo navegador. */
function client(id: ArchitectureId): AxiosInstance {
  const c = axios.create({ baseURL: `/api/${id}`, timeout: 15000 });
  c.interceptors.request.use((cfg) => {
    (cfg as typeof cfg & { _t: number })._t = performance.now();
    const t = tokens[id];
    if (t) cfg.headers.set("Authorization", `Bearer ${t}`);
    return cfg;
  });
  const log = (status: number, cfg: { method?: string; url?: string; _t?: number }) => {
    const entry: RequestLogEntry = {
      id: ++seq,
      architecture: id,
      method: (cfg.method ?? "get").toUpperCase(),
      path: cfg.url ?? "",
      status,
      ms: +(performance.now() - (cfg._t ?? performance.now())).toFixed(1),
      at: Date.now(),
    };
    listeners.forEach((l) => l(entry));
  };
  c.interceptors.response.use(
    (res) => {
      log(res.status, res.config as never);
      return res;
    },
    (err: AxiosError) => {
      if (err.config) log(err.response?.status ?? 0, err.config as never);
      return Promise.reject(err);
    },
  );
  return c;
}

const clients = Object.fromEntries(ARCHITECTURES.map((a) => [a.id, client(a.id)])) as Record<
  ArchitectureId,
  AxiosInstance
>;

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return "API fora do ar ou inacessível";
    return (err.response.data as { error?: string })?.error ?? `Erro ${err.response.status}`;
  }
  return err instanceof Error ? err.message : "Erro inesperado";
}

// ---- sessão: o mesmo usuário nas três APIs (cada uma tem o próprio banco) ----

export interface SessionResult {
  user: User | null;
  failures: Partial<Record<ArchitectureId, string>>;
}

async function authAll(path: "/auth/login" | "/auth/register", body: object): Promise<SessionResult> {
  const settled = await Promise.allSettled(
    ARCHITECTURES.map((a) => clients[a.id].post<{ token: string; user: User }>(path, body)),
  );
  const failures: SessionResult["failures"] = {};
  let user: User | null = null;
  settled.forEach((s, i) => {
    const id = ARCHITECTURES[i].id;
    if (s.status === "fulfilled") {
      tokens[id] = s.value.data.token;
      user = s.value.data.user;
    } else failures[id] = errorMessage(s.reason);
  });
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { user, failures };
}

export const session = {
  login: (email: string, password: string) => authAll("/auth/login", { email, password }),
  register: (name: string, email: string, password: string) => authAll("/auth/register", { name, email, password }),
  current(): User | null {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) ?? "null");
    } catch {
      return null;
    }
  },
  hasToken: (id: ArchitectureId) => Boolean(tokens[id]),
  logout() {
    tokens = {};
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ---- tarefas ----

export type TaskInput = Pick<Task, "title" | "description" | "status" | "priority">;

export const tasksApi = (id: ArchitectureId) => ({
  list: () => clients[id].get<Task[]>("/tasks").then((r) => r.data),
  create: (t: TaskInput) => clients[id].post<Task>("/tasks", t).then((r) => r.data),
  update: (taskId: number, t: Partial<TaskInput>) => clients[id].put<Task>(`/tasks/${taskId}`, t).then((r) => r.data),
  remove: (taskId: number) => clients[id].delete(`/tasks/${taskId}`),
});

// ---- bench ----

const bench = axios.create({ baseURL: "/bench", timeout: 30000 });

export const benchApi = {
  architectures: () =>
    bench
      .get<Array<{ id: ArchitectureId; label: string; online: boolean; pingMs: number | null }>>("/architectures")
      .then((r) => r.data),
  runtime: () =>
    bench.get<Array<{ id: ArchitectureId; metrics: RuntimeMetrics | null }>>("/runtime").then((r) => r.data),
  code: (refresh = false) =>
    bench
      .get<Array<{ id: ArchitectureId; label: string; metrics: CodeMetrics }>>("/code", {
        params: refresh ? { refresh: 1 } : undefined,
      })
      .then((r) => r.data),
  runs: () => bench.get<LoadTestRun[]>("/loadtests").then((r) => r.data),
  run: (id: string) => bench.get<LoadTestRun>(`/loadtests/${id}`).then((r) => r.data),
  start: (p: LoadTestParams) => bench.post<LoadTestRun>("/loadtests", p).then((r) => r.data),
  remove: (id: string) => bench.delete(`/loadtests/${id}`),
  csvUrl: (id: string) => `/bench/loadtests/${id}/csv`,
};
