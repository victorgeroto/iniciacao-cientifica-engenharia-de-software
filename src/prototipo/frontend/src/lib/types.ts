import type { ArchitectureId } from "./architectures";

export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
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

export interface RuntimeMetrics {
  architecture: string;
  uptimeSeconds: number;
  requests: LatencySummary;
  routes: Record<string, LatencySummary>;
  memory: { rssMb: number; heapUsedMb: number; heapTotalMb: number; externalMb: number };
  cpu: { userMs: number; systemMs: number };
}

export interface CodeMetrics {
  files: number;
  loc: number;
  locByLayer: Record<string, number>;
  filesByLayer: Record<string, number>;
  avgFanOut: number;
  maxFanOut: number;
  crossLayerDependencies: number;
  layerDependencies: Record<string, string[]>;
  externalPackages: string[];
  tests: { files: number; loc: number };
  coverage: { lines: number; statements: number; functions: number; branches: number } | null;
  coverageByLayer: Record<string, number> | null;
}

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

export interface LoadTestResult {
  architecture: ArchitectureId;
  round: number;
  order: number;
  requests: number;
  requestsPerSecond: number;
  throughputKBps: number;
  latencyMs: { mean: number; p50: number; p90: number; p99: number; max: number };
  errors: number;
  non2xx: number;
  server: { p95Ms: number; meanMs: number; rssMb: number; heapUsedMb: number; cpuMs?: number } | null;
}

export interface LoadTestRun {
  id: string;
  status: "running" | "done" | "failed";
  startedAt: string;
  finishedAt?: string;
  params: LoadTestParams;
  progress: { completed: number; total: number; current?: string };
  results: LoadTestResult[];
  error?: string;
}
