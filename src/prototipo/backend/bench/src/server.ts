/** Serviço de benchmark: orquestra testes de carga e agrega métricas das três APIs. */
import express from "express";
import { analyzeProject, CodeMetrics } from "./codeMetrics";
import { ARCHITECTURES, PORT } from "./config";
import { executeRun, LoadTestRun, normalizeParams, toCsv } from "./loadtest";
import { RunStore } from "./store";

export function createBenchApp(store = new RunStore()) {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "bench" }));

  app.get("/architectures", async (_req, res) => {
    const out = await Promise.all(
      ARCHITECTURES.map(async (a) => {
        const started = performance.now();
        try {
          const r = await fetch(`${a.url}/health`, { signal: AbortSignal.timeout(2000) });
          return { id: a.id, label: a.label, online: r.ok, pingMs: +(performance.now() - started).toFixed(1) };
        } catch {
          return { id: a.id, label: a.label, online: false, pingMs: null };
        }
      }),
    );
    res.json(out);
  });

  app.get("/runtime", async (_req, res) => {
    const out = await Promise.all(
      ARCHITECTURES.map(async (a) => {
        try {
          const r = await fetch(`${a.url}/metrics`, { signal: AbortSignal.timeout(2000) });
          return { id: a.id, metrics: await r.json() };
        } catch {
          return { id: a.id, metrics: null };
        }
      }),
    );
    res.json(out);
  });

  let codeCache: { at: number; data: { id: string; label: string; metrics: CodeMetrics }[] } | null = null;
  app.get("/code", (req, res) => {
    if (!codeCache || req.query.refresh === "1" || Date.now() - codeCache.at > 60_000) {
      codeCache = {
        at: Date.now(),
        data: ARCHITECTURES.map((a) => ({ id: a.id, label: a.label, metrics: analyzeProject(a.sourceDir) })),
      };
    }
    res.json(codeCache.data);
  });

  app.get("/loadtests", (_req, res) => res.json(store.list()));

  app.get("/loadtests/:id", (req, res) => {
    const run = store.get(req.params.id);
    return run ? res.json(run) : res.status(404).json({ error: "Execução não encontrada" });
  });

  app.get("/loadtests/:id/csv", (req, res) => {
    const run = store.get(req.params.id);
    if (!run) return res.status(404).json({ error: "Execução não encontrada" });
    res.setHeader("content-type", "text/csv; charset=utf-8");
    res.setHeader("content-disposition", `attachment; filename="carga-${run.id}.csv"`);
    res.send(toCsv(run));
  });

  app.delete("/loadtests/:id", (req, res) => {
    return store.remove(req.params.id) ? res.status(204).end() : res.status(404).json({ error: "Não removido" });
  });

  app.post("/loadtests", (req, res) => {
    if (store.running()) return res.status(409).json({ error: "Já existe um teste em execução" });
    const params = normalizeParams(req.body);
    const run: LoadTestRun = {
      id: new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14),
      status: "running",
      startedAt: new Date().toISOString(),
      params,
      progress: { completed: 0, total: params.rounds * params.architectures.length },
      results: [],
    };
    store.add(run);
    executeRun(run, () => store.save())
      .then(() => {
        run.status = "done";
      })
      .catch((err: Error) => {
        run.status = "failed";
        run.error = err.message;
      })
      .finally(() => {
        run.progress.current = undefined;
        run.finishedAt = new Date().toISOString();
        store.save();
      });
    res.status(202).json(run);
  });

  return app;
}

if (require.main === module) {
  createBenchApp().listen(PORT, () => console.log(`[bench] ouvindo na porta ${PORT}`));
}
