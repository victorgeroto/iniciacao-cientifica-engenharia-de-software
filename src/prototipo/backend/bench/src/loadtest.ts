/**
 * Teste de carga controlado (autocannon), com o mesmo cenário e os mesmos
 * parâmetros para as três APIs.
 *
 * Procedimento por rodada e por arquitetura:
 *   1. cria um usuário exclusivo e N tarefas de semente;
 *   2. aquece (warm-up) sem registrar;
 *   3. zera as métricas do servidor;
 *   4. mede pelo tempo configurado;
 *   5. lê a métrica do lado do servidor (latência interna, memória).
 * A ordem das arquiteturas gira a cada rodada, para não favorecer a primeira.
 */
import autocannon from "autocannon";
import { ARCHITECTURES, ArchitectureConfig, ArchitectureId } from "./config";

export type Scenario = "list" | "get" | "create" | "mixed";

export interface LoadTestParams {
  scenario: Scenario;
  connections: number;
  durationSeconds: number;
  warmupSeconds: number;
  rounds: number;
  seedTasks: number;
  architectures: ArchitectureId[];
}

export interface ArchitectureResult {
  architecture: ArchitectureId;
  round: number;
  order: number;
  requests: number;
  requestsPerSecond: number;
  throughputKBps: number;
  latencyMs: { mean: number; p50: number; p90: number; p99: number; max: number };
  errors: number;
  non2xx: number;
  server: { p95Ms: number; meanMs: number; rssMb: number; heapUsedMb: number } | null;
}

export interface LoadTestRun {
  id: string;
  status: "running" | "done" | "failed";
  startedAt: string;
  finishedAt?: string;
  params: LoadTestParams;
  progress: { completed: number; total: number; current?: string };
  results: ArchitectureResult[];
  error?: string;
}

export const DEFAULT_PARAMS: LoadTestParams = {
  scenario: "list",
  connections: 10,
  durationSeconds: 10,
  warmupSeconds: 2,
  rounds: 1,
  seedTasks: 20,
  architectures: ["monolito", "camadas", "clean"],
};

export function normalizeParams(input: Partial<LoadTestParams> = {}): LoadTestParams {
  const clamp = (v: unknown, min: number, max: number, def: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : def;
  };
  const scenarios: Scenario[] = ["list", "get", "create", "mixed"];
  const archs = (input.architectures ?? DEFAULT_PARAMS.architectures).filter((a) =>
    ARCHITECTURES.some((c) => c.id === a),
  );
  return {
    scenario: scenarios.includes(input.scenario as Scenario) ? (input.scenario as Scenario) : DEFAULT_PARAMS.scenario,
    connections: clamp(input.connections, 1, 200, DEFAULT_PARAMS.connections),
    durationSeconds: clamp(input.durationSeconds, 1, 120, DEFAULT_PARAMS.durationSeconds),
    warmupSeconds: clamp(input.warmupSeconds, 0, 30, DEFAULT_PARAMS.warmupSeconds),
    rounds: clamp(input.rounds, 1, 10, DEFAULT_PARAMS.rounds),
    seedTasks: clamp(input.seedTasks, 1, 500, DEFAULT_PARAMS.seedTasks),
    architectures: archs.length ? archs : DEFAULT_PARAMS.architectures,
  };
}

/** Ordem rotacionada por rodada: [A,B,C], [B,C,A], [C,A,B]... */
export function roundOrder<T>(items: T[], round: number): T[] {
  const k = round % items.length;
  return [...items.slice(k), ...items.slice(0, k)];
}

async function json(url: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(url, { ...init, headers: { "content-type": "application/json", ...(init.headers ?? {}) } });
  if (!res.ok && res.status !== 204) throw new Error(`${init.method ?? "GET"} ${url} → ${res.status}`);
  return res.status === 204 ? null : res.json();
}

async function prepare(arch: ArchitectureConfig, runId: string, seed: number) {
  const email = `bench-${runId}-${Math.random().toString(36).slice(2, 8)}@bench.local`;
  const { token } = await json(`${arch.url}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ name: "Bench", email, password: "bench-123" }),
  });
  const headers = { authorization: `Bearer ${token}` };
  let firstId = 0;
  for (let i = 0; i < seed; i++) {
    const t = await json(`${arch.url}/tasks`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title: `Tarefa semente ${i + 1}`, priority: ["low", "medium", "high"][i % 3] }),
    });
    if (i === 0) firstId = t.id;
  }
  return { token, firstId };
}

function requestsFor(scenario: Scenario, firstId: number): autocannon.Request[] {
  const create: autocannon.Request = {
    method: "POST",
    path: "/tasks",
    body: JSON.stringify({ title: "Tarefa de carga", description: "gerada pelo benchmark", priority: "medium" }),
  };
  switch (scenario) {
    case "list":
      return [{ method: "GET", path: "/tasks" }];
    case "get":
      return [{ method: "GET", path: `/tasks/${firstId}` }];
    case "create":
      return [create];
    case "mixed":
      return [{ method: "GET", path: "/tasks" }, { method: "GET", path: `/tasks/${firstId}` }, create];
  }
}

function fire(url: string, token: string, requests: autocannon.Request[], connections: number, duration: number) {
  return autocannon({
    url,
    connections,
    duration,
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    requests,
  });
}

export async function measureArchitecture(
  arch: ArchitectureConfig,
  params: LoadTestParams,
  runId: string,
  round: number,
  order: number,
): Promise<ArchitectureResult> {
  const { token, firstId } = await prepare(arch, runId, params.seedTasks);
  const requests = requestsFor(params.scenario, firstId);
  if (params.warmupSeconds > 0) await fire(arch.url, token, requests, params.connections, params.warmupSeconds);
  await json(`${arch.url}/metrics/reset`, { method: "POST" });

  const r = await fire(arch.url, token, requests, params.connections, params.durationSeconds);

  let server: ArchitectureResult["server"] = null;
  try {
    const snap = await json(`${arch.url}/metrics`);
    server = {
      p95Ms: snap.requests.p95Ms,
      meanMs: snap.requests.meanMs,
      rssMb: snap.memory.rssMb,
      heapUsedMb: snap.memory.heapUsedMb,
    };
  } catch {
    server = null;
  }

  return {
    architecture: arch.id,
    round,
    order,
    requests: r.requests.total,
    requestsPerSecond: +r.requests.average.toFixed(2),
    throughputKBps: +(r.throughput.average / 1024).toFixed(2),
    latencyMs: {
      mean: +r.latency.average.toFixed(3),
      p50: r.latency.p50,
      p90: r.latency.p90,
      p99: r.latency.p99,
      max: r.latency.max,
    },
    errors: r.errors + r.timeouts,
    non2xx: r.non2xx,
    server,
  };
}

export async function executeRun(run: LoadTestRun, onProgress: () => void): Promise<void> {
  const selected = ARCHITECTURES.filter((a) => run.params.architectures.includes(a.id));
  for (let round = 0; round < run.params.rounds; round++) {
    const order = roundOrder(selected, round);
    for (let i = 0; i < order.length; i++) {
      run.progress.current = `${order[i].label} · rodada ${round + 1}/${run.params.rounds}`;
      onProgress();
      run.results.push(await measureArchitecture(order[i], run.params, run.id, round + 1, i + 1));
      run.progress.completed++;
      onProgress();
    }
  }
}

export function toCsv(run: LoadTestRun): string {
  const header = [
    "run_id", "cenario", "conexoes", "duracao_s", "rodada", "ordem", "arquitetura", "requisicoes",
    "req_por_s", "throughput_kBps", "lat_media_ms", "lat_p50_ms", "lat_p90_ms", "lat_p99_ms", "lat_max_ms",
    "erros", "nao_2xx", "servidor_p95_ms", "servidor_media_ms", "rss_mb", "heap_mb",
  ];
  const rows = run.results.map((r) => [
    run.id, run.params.scenario, run.params.connections, run.params.durationSeconds, r.round, r.order,
    r.architecture, r.requests, r.requestsPerSecond, r.throughputKBps, r.latencyMs.mean, r.latencyMs.p50,
    r.latencyMs.p90, r.latencyMs.p99, r.latencyMs.max, r.errors, r.non2xx, r.server?.p95Ms ?? "",
    r.server?.meanMs ?? "", r.server?.rssMb ?? "", r.server?.heapUsedMb ?? "",
  ]);
  return [header, ...rows].map((r) => r.join(",")).join("\n") + "\n";
}
