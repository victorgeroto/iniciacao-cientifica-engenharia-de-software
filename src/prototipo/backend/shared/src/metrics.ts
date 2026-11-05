/**
 * Instrumentação idêntica para as três APIs.
 *
 * É o único código compartilhado entre as arquiteturas, de propósito: a forma de
 * medir não pode variar, senão a diferença medida deixa de ser só a arquitetura.
 */
import type { NextFunction, Request, Response } from "express";

const MAX_SAMPLES = 20_000;

interface RouteStats {
  count: number;
  errors: number;
  totalMs: number;
  samples: number[];
}

export interface LatencySummary {
  count: number;
  errors: number;
  meanMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  maxMs: number;
}

export interface MetricsSnapshot {
  architecture: string;
  startedAt: string;
  uptimeSeconds: number;
  requests: LatencySummary;
  routes: Record<string, LatencySummary>;
  memory: { rssMb: number; heapUsedMb: number; heapTotalMb: number; externalMb: number };
  cpu: { userMs: number; systemMs: number };
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, idx)];
}

function summarize(s: RouteStats): LatencySummary {
  const sorted = [...s.samples].sort((a, b) => a - b);
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return {
    count: s.count,
    errors: s.errors,
    meanMs: round(s.count ? s.totalMs / s.count : 0),
    p50Ms: round(percentile(sorted, 50)),
    p95Ms: round(percentile(sorted, 95)),
    p99Ms: round(percentile(sorted, 99)),
    maxMs: round(sorted.length ? sorted[sorted.length - 1] : 0),
  };
}

function emptyStats(): RouteStats {
  return { count: 0, errors: 0, totalMs: 0, samples: [] };
}

function record(stats: RouteStats, ms: number, isError: boolean): void {
  stats.count += 1;
  stats.totalMs += ms;
  if (isError) stats.errors += 1;
  // Reservoir simples: mantém as amostras mais recentes até o limite.
  if (stats.samples.length >= MAX_SAMPLES) stats.samples.shift();
  stats.samples.push(ms);
}

const MB = 1024 * 1024;

export class MetricsRegistry {
  private startedAt = new Date();
  private all = emptyStats();
  private routes = new Map<string, RouteStats>();
  private cpuBase = process.cpuUsage();

  constructor(private readonly architecture: string) {}

  /** Middleware Express: mede do recebimento ao fim da resposta. */
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.path === "/metrics" || req.path === "/health") return next();
      const start = process.hrtime.bigint();
      res.on("finish", () => {
        const ms = Number(process.hrtime.bigint() - start) / 1e6;
        const routePath = req.route?.path ? `${req.baseUrl}${req.route.path}` : "(sem rota)";
        const key = `${req.method} ${routePath}`;
        const isError = res.statusCode >= 500;
        record(this.all, ms, isError);
        if (!this.routes.has(key)) this.routes.set(key, emptyStats());
        record(this.routes.get(key)!, ms, isError);
      });
      next();
    };
  }

  snapshot(): MetricsSnapshot {
    const mem = process.memoryUsage();
    const cpu = process.cpuUsage(this.cpuBase);
    const routes: Record<string, LatencySummary> = {};
    for (const [k, v] of this.routes) routes[k] = summarize(v);
    return {
      architecture: this.architecture,
      startedAt: this.startedAt.toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      requests: summarize(this.all),
      routes,
      memory: {
        rssMb: +(mem.rss / MB).toFixed(2),
        heapUsedMb: +(mem.heapUsed / MB).toFixed(2),
        heapTotalMb: +(mem.heapTotal / MB).toFixed(2),
        externalMb: +(mem.external / MB).toFixed(2),
      },
      cpu: { userMs: Math.round(cpu.user / 1000), systemMs: Math.round(cpu.system / 1000) },
    };
  }

  reset(): void {
    this.all = emptyStats();
    this.routes.clear();
    this.cpuBase = process.cpuUsage();
  }
}

/** Registra GET /metrics, POST /metrics/reset e GET /health no app. */
export function mountMetricsEndpoints(
  app: { get: Function; post: Function },
  registry: MetricsRegistry,
  architecture: string,
): void {
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", architecture });
  });
  app.get("/metrics", (_req: Request, res: Response) => {
    res.json(registry.snapshot());
  });
  app.post("/metrics/reset", (_req: Request, res: Response) => {
    registry.reset();
    res.status(204).end();
  });
}
