import { FormEvent, useEffect, useRef, useState } from "react";
import { Download, FlaskConical, History, Play, Trash2 } from "lucide-react";
import { ArchBarChart, GroupedArchChart } from "../components/Charts";
import { PageHeader } from "../components/Layout";
import { Alert, ArchBadge, Button, Card, EmptyState, IconButton, Input, Select, cx } from "../components/ui";
import { benchApi, errorMessage } from "../lib/api";
import { ARCHITECTURES, ArchitectureId } from "../lib/architectures";
import type { LoadTestParams, LoadTestResult, LoadTestRun, Scenario } from "../lib/types";

const SCENARIOS: Record<Scenario, string> = {
  list: "Listar tarefas (GET /tasks)",
  get: "Buscar uma tarefa (GET /tasks/:id)",
  create: "Criar tarefas (POST /tasks)",
  mixed: "Misto (buscar e criar)",
};

const DEFAULTS: LoadTestParams = {
  scenario: "list",
  connections: 10,
  durationSeconds: 10,
  warmupSeconds: 2,
  rounds: 1,
  seedTasks: 20,
  architectures: ["monolito", "camadas", "clean"],
};

interface Aggregate {
  id: ArchitectureId;
  rounds: number;
  rps: number;
  rpsSd: number;
  p50: number;
  p90: number;
  p99: number;
  mean: number;
  errors: number;
  rssMb: number | null;
}

const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
const sd = (xs: number[]) => {
  if (xs.length < 2) return 0;
  const m = avg(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
};

export function aggregate(results: LoadTestResult[]): Aggregate[] {
  return ARCHITECTURES.flatMap((a) => {
    const rs = results.filter((r) => r.architecture === a.id);
    if (!rs.length) return [];
    const rss = rs.map((r) => r.server?.rssMb).filter((v): v is number => typeof v === "number");
    return [
      {
        id: a.id,
        rounds: rs.length,
        rps: avg(rs.map((r) => r.requestsPerSecond)),
        rpsSd: sd(rs.map((r) => r.requestsPerSecond)),
        p50: avg(rs.map((r) => r.latencyMs.p50)),
        p90: avg(rs.map((r) => r.latencyMs.p90)),
        p99: avg(rs.map((r) => r.latencyMs.p99)),
        mean: avg(rs.map((r) => r.latencyMs.mean)),
        errors: rs.reduce((s, r) => s + r.errors + r.non2xx, 0),
        rssMb: rss.length ? avg(rss) : null,
      },
    ];
  });
}

const f = (v: number, d = 1) => v.toLocaleString("pt-BR", { maximumFractionDigits: d });

function estimateSeconds(p: LoadTestParams) {
  return p.rounds * p.architectures.length * (p.durationSeconds + p.warmupSeconds + 2);
}

export function LoadTestPage() {
  const [params, setParams] = useState<LoadTestParams>(DEFAULTS);
  const [runs, setRuns] = useState<LoadTestRun[]>([]);
  const [selected, setSelected] = useState<LoadTestRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const poll = useRef<ReturnType<typeof setInterval>>();

  const refreshRuns = () =>
    benchApi
      .runs()
      .then((list) => {
        setRuns(list);
        setSelected((cur) => (cur ? (list.find((r) => r.id === cur.id) ?? cur) : (list[0] ?? null)));
      })
      .catch((err) => setError(`Serviço de benchmark indisponível: ${errorMessage(err)}`));

  useEffect(() => {
    refreshRuns();
    return () => clearInterval(poll.current);
  }, []);

  const running = runs.find((r) => r.status === "running");

  useEffect(() => {
    clearInterval(poll.current);
    if (running) poll.current = setInterval(refreshRuns, 1000);
  }, [running?.id]);

  const num = (k: keyof LoadTestParams) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setParams((p) => ({ ...p, [k]: Number(e.target.value) }));

  function toggleArch(id: ArchitectureId) {
    setParams((p) => ({
      ...p,
      architectures: p.architectures.includes(id) ? p.architectures.filter((a) => a !== id) : [...p.architectures, id],
    }));
  }

  async function start(ev: FormEvent) {
    ev.preventDefault();
    if (!params.architectures.length) {
      setError("Selecione pelo menos uma arquitetura.");
      return;
    }
    setError(null);
    setStarting(true);
    try {
      const run = await benchApi.start(params);
      setSelected(run);
      await refreshRuns();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setStarting(false);
    }
  }

  async function remove(run: LoadTestRun) {
    if (!window.confirm(`Excluir a execução ${run.id}?`)) return;
    await benchApi.remove(run.id);
    if (selected?.id === run.id) setSelected(null);
    refreshRuns();
  }

  const view = selected;
  const agg = view ? aggregate(view.results) : [];

  return (
    <>
      <PageHeader
        eyebrow="Experimento"
        title="Teste de carga"
        description="Mesmo cenário e mesmos parâmetros para as três APIs. A ordem gira a cada rodada para não favorecer nenhuma."
      />
      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card title="Parâmetros">
            <form onSubmit={start} className="flex flex-col gap-4">
              <Select
                label="Cenário"
                value={params.scenario}
                onChange={(e) => setParams({ ...params, scenario: e.target.value as Scenario })}
              >
                {(Object.keys(SCENARIOS) as Scenario[]).map((s) => (
                  <option key={s} value={s}>
                    {SCENARIOS[s]}
                  </option>
                ))}
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Conexões" type="number" min={1} max={200} value={params.connections} onChange={num("connections")} />
                <Input label="Duração (s)" type="number" min={1} max={120} value={params.durationSeconds} onChange={num("durationSeconds")} />
                <Input label="Aquecimento (s)" type="number" min={0} max={30} value={params.warmupSeconds} onChange={num("warmupSeconds")} />
                <Input label="Rodadas" type="number" min={1} max={10} value={params.rounds} onChange={num("rounds")} />
              </div>
              <Input
                label="Tarefas de semente"
                type="number"
                min={1}
                max={500}
                value={params.seedTasks}
                onChange={num("seedTasks")}
                hint="Criadas para um usuário novo antes de cada medição."
              />
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-1 text-sm font-medium">Arquiteturas</legend>
                {ARCHITECTURES.map((a) => (
                  <label key={a.id} className="flex min-h-11 items-center gap-3 rounded-lg border border-border px-3">
                    <input
                      type="checkbox"
                      className="size-4 accent-[var(--color-accent)]"
                      checked={params.architectures.includes(a.id)}
                      onChange={() => toggleArch(a.id)}
                    />
                    <ArchBadge id={a.id} />
                  </label>
                ))}
              </fieldset>
              <p className="text-xs text-fg-muted">Duração estimada: ~{estimateSeconds(params)} s.</p>
              <Button type="submit" loading={starting} disabled={Boolean(running)}>
                <Play className="size-4" aria-hidden /> {running ? "Teste em execução…" : "Iniciar teste"}
              </Button>
            </form>
          </Card>

          <Card title={<span className="inline-flex items-center gap-2"><History className="size-4" aria-hidden /> Histórico</span>}>
            {runs.length === 0 ? (
              <p className="text-sm text-fg-muted">Nenhuma execução ainda.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {runs.map((r) => (
                  <li key={r.id} className="flex items-center gap-1">
                    <button
                      onClick={() => setSelected(r)}
                      aria-current={selected?.id === r.id || undefined}
                      className={cx(
                        "flex min-h-11 flex-1 flex-col items-start rounded-lg px-3 py-1.5 text-left text-sm transition-colors duration-200",
                        selected?.id === r.id ? "bg-surface-2" : "hover:bg-surface-2",
                      )}
                    >
                      <span className="font-mono text-xs">{new Date(r.startedAt).toLocaleString("pt-BR")}</span>
                      <span className="text-xs text-fg-muted">
                        {SCENARIOS[r.params.scenario].split(" (")[0]} · {r.params.connections} conexões ·{" "}
                        <span className={r.status === "failed" ? "text-danger" : r.status === "running" ? "text-warning" : ""}>
                          {r.status === "done" ? "concluído" : r.status === "running" ? "executando" : "falhou"}
                        </span>
                      </span>
                    </button>
                    {r.status !== "running" && (
                      <IconButton label={`Excluir execução ${r.id}`} onClick={() => remove(r)} className="hover:text-danger">
                        <Trash2 className="size-4" />
                      </IconButton>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          {!view ? (
            <EmptyState icon={<FlaskConical className="size-8" />} title="Nenhum resultado selecionado">
              Configure os parâmetros e inicie um teste. Os resultados ficam salvos em <code>data/bruto/carga</code>.
            </EmptyState>
          ) : (
            <>
              {view.status === "running" && (
                <Card title="Em execução">
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={view.progress.total}
                    aria-valuenow={view.progress.completed}
                    aria-label="Progresso do teste"
                    className="h-2 overflow-hidden rounded bg-surface-2"
                  >
                    <div
                      className="h-2 bg-accent transition-[width] duration-300"
                      style={{ width: `${(view.progress.completed / view.progress.total) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-fg-muted" aria-live="polite">
                    {view.progress.completed}/{view.progress.total} medições · {view.progress.current ?? "preparando"}
                  </p>
                </Card>
              )}
              {view.status === "failed" && <Alert>Falha na execução: {view.error ?? "interrompida"}</Alert>}

              {agg.length > 0 && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card title="Throughput (requisições/s) — maior é melhor">
                      <ArchBarChart label="Requisições por segundo" data={agg.map((a) => ({ id: a.id, value: a.rps }))} />
                    </Card>
                    <Card title="Latência média (ms) — menor é melhor">
                      <ArchBarChart label="Latência média" unit="ms" data={agg.map((a) => ({ id: a.id, value: a.mean }))} />
                    </Card>
                  </div>
                  <Card title="Distribuição de latência (ms)">
                    <GroupedArchChart
                      label="Percentis de latência"
                      unit="ms"
                      categories={["p50", "p90", "p99"]}
                      values={Object.fromEntries(agg.map((a) => [a.id, { p50: a.p50, p90: a.p90, p99: a.p99 }]))}
                    />
                  </Card>
                  <Card
                    title="Resultados"
                    actions={
                      view.status === "done" && (
                        <a
                          href={benchApi.csvUrl(view.id)}
                          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-strong px-4 text-sm hover:border-fg-muted"
                        >
                          <Download className="size-4" aria-hidden /> Baixar CSV
                        </a>
                      )
                    }
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[680px] text-sm">
                        <caption className="sr-only">Resultados agregados por arquitetura</caption>
                        <thead className="text-left text-fg-muted">
                          <tr className="border-b border-border">
                            <th scope="col" className="py-2 pr-4 font-medium">Arquitetura</th>
                            <th scope="col" className="py-2 pr-4 text-right font-medium">Rodadas</th>
                            <th scope="col" className="py-2 pr-4 text-right font-medium">req/s (± dp)</th>
                            <th scope="col" className="py-2 pr-4 text-right font-medium">Média</th>
                            <th scope="col" className="py-2 pr-4 text-right font-medium">p50</th>
                            <th scope="col" className="py-2 pr-4 text-right font-medium">p90</th>
                            <th scope="col" className="py-2 pr-4 text-right font-medium">p99</th>
                            <th scope="col" className="py-2 pr-4 text-right font-medium">Erros</th>
                            <th scope="col" className="py-2 text-right font-medium">RSS (MB)</th>
                          </tr>
                        </thead>
                        <tbody className="tabular">
                          {agg.map((a) => (
                            <tr key={a.id} className="border-b border-border/60">
                              <th scope="row" className="py-2 pr-4 text-left font-normal">
                                <ArchBadge id={a.id} />
                              </th>
                              <td className="py-2 pr-4 text-right">{a.rounds}</td>
                              <td className="py-2 pr-4 text-right">
                                {f(a.rps)} {a.rounds > 1 && <span className="text-fg-muted">± {f(a.rpsSd)}</span>}
                              </td>
                              <td className="py-2 pr-4 text-right">{f(a.mean, 2)}</td>
                              <td className="py-2 pr-4 text-right">{f(a.p50, 2)}</td>
                              <td className="py-2 pr-4 text-right">{f(a.p90, 2)}</td>
                              <td className="py-2 pr-4 text-right">{f(a.p99, 2)}</td>
                              <td className={cx("py-2 pr-4 text-right", a.errors > 0 && "text-danger")}>{a.errors}</td>
                              <td className="py-2 text-right">{a.rssMb === null ? "—" : f(a.rssMb)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-xs text-fg-muted">
                      Latências medidas pelo gerador de carga (autocannon), em ms. Cenário: {SCENARIOS[view.params.scenario]} ·{" "}
                      {view.params.connections} conexões · {view.params.durationSeconds} s por medição · aquecimento de{" "}
                      {view.params.warmupSeconds} s.
                    </p>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
