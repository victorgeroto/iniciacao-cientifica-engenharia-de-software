import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ArchBarChart } from "../components/Charts";
import { PageHeader } from "../components/Layout";
import { Alert, ArchBadge, Button, Card, Skeleton } from "../components/ui";
import { benchApi, errorMessage } from "../lib/api";
import { ARCHITECTURES, ArchitectureId, archById } from "../lib/architectures";
import type { CodeMetrics, RuntimeMetrics } from "../lib/types";

type CodeRow = { id: ArchitectureId; metrics: CodeMetrics };
type RuntimeRow = { id: ArchitectureId; metrics: RuntimeMetrics | null };

const n = (v: number | null | undefined, digits = 1) =>
  v === null || v === undefined ? "—" : v.toLocaleString("pt-BR", { maximumFractionDigits: digits });

function businessCoverage(row: CodeRow): number | null {
  return row.metrics.coverageByLayer?.[archById(row.id).businessLayer] ?? null;
}

export function MetricsPage() {
  const [code, setCode] = useState<CodeRow[] | null>(null);
  const [runtime, setRuntime] = useState<RuntimeRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadCode(refresh = false) {
    setRefreshing(true);
    try {
      setCode(await benchApi.code(refresh));
      setError(null);
    } catch (err) {
      setError(`Serviço de benchmark indisponível: ${errorMessage(err)}`);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCode();
    let alive = true;
    const tick = () =>
      benchApi
        .runtime()
        .then((r) => alive && setRuntime(r))
        .catch(() => alive && setRuntime([]));
    tick();
    const t = setInterval(tick, 5000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const metric = (pick: (m: CodeMetrics, row: CodeRow) => number | null) =>
    (code ?? []).map((r) => ({ id: r.id, value: pick(r.metrics, r) }));

  return (
    <>
      <PageHeader
        eyebrow="Código e execução"
        title="Métricas"
        description="Indicadores estáticos do código e indicadores de execução de cada API, calculados da mesma forma para as três."
        actions={
          <Button variant="secondary" loading={refreshing} onClick={() => loadCode(true)}>
            <RefreshCw className="size-4" aria-hidden /> Recalcular
          </Button>
        }
      />
      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">Código</h2>
      {code === null ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card title="Linhas de código (LOC)" description="Tamanho do src/ sem linhas vazias e comentários" className="lg:col-span-2">
              <ArchBarChart label="Linhas de código" data={metric((m) => m.loc)} />
            </Card>
            <Card title="Acoplamento" description="Fan-out médio por arquivo">
              <ArchBarChart label="Fan-out médio" data={metric((m) => m.avgFanOut)} />
              <p className="mt-2 text-xs text-fg-muted">Imports internos por arquivo. Mais camadas tendem a elevar o valor.</p>
            </Card>
            <Card title="Cobertura total" description="Linhas cobertas em todo o src/">
              <ArchBarChart label="Cobertura total" unit="%" data={metric((m) => m.coverage?.lines ?? null)} />
            </Card>
            <Card title="Cobertura da regra de negócio" description="Mesmos 8 casos de teste, só na camada de negócio" className="lg:col-span-2">
              <ArchBarChart label="Cobertura da regra de negócio" unit="%" data={metric((_m, r) => businessCoverage(r))} />
              <p className="mt-2 text-xs text-fg-muted">
                Monólito: arquivo único · Camadas: <code>services/</code> · Clean: <code>domain/</code>.
              </p>
            </Card>
          </div>

          <Card title="Tabela de métricas de código" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <caption className="sr-only">Métricas de código por arquitetura</caption>
                <thead className="text-left text-fg-muted">
                  <tr className="border-b border-border">
                    <th scope="col" className="py-2 pr-4 font-medium">Arquitetura</th>
                    <th scope="col" className="py-2 pr-4 text-right font-medium">Arquivos</th>
                    <th scope="col" className="py-2 pr-4 text-right font-medium">LOC</th>
                    <th scope="col" className="py-2 pr-4 text-right font-medium">Fan-out médio / máx.</th>
                    <th scope="col" className="py-2 pr-4 text-right font-medium">Dep. entre camadas</th>
                    <th scope="col" className="py-2 pr-4 text-right font-medium">LOC de teste</th>
                    <th scope="col" className="py-2 pr-4 text-right font-medium">Cobertura total</th>
                    <th scope="col" className="py-2 text-right font-medium">Cobertura negócio</th>
                  </tr>
                </thead>
                <tbody className="tabular">
                  {code.map((r) => (
                    <tr key={r.id} className="border-b border-border/60">
                      <th scope="row" className="py-2 pr-4 text-left font-normal">
                        <ArchBadge id={r.id} />
                      </th>
                      <td className="py-2 pr-4 text-right">{r.metrics.files}</td>
                      <td className="py-2 pr-4 text-right">{r.metrics.loc}</td>
                      <td className="py-2 pr-4 text-right">
                        {n(r.metrics.avgFanOut, 2)} / {r.metrics.maxFanOut}
                      </td>
                      <td className="py-2 pr-4 text-right">{r.metrics.crossLayerDependencies}</td>
                      <td className="py-2 pr-4 text-right">{r.metrics.tests.loc}</td>
                      <td className="py-2 pr-4 text-right">{n(r.metrics.coverage?.lines)}%</td>
                      <td className="py-2 text-right">{n(businessCoverage(r))}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {code.map((r) => (
              <Card key={r.id} title={<ArchBadge id={r.id} />}>
                <p className="mb-2 text-xs text-fg-muted">LOC por camada</p>
                <ul className="flex flex-col gap-1.5">
                  {Object.entries(r.metrics.locByLayer)
                    .sort((a, b) => b[1] - a[1])
                    .map(([layer, loc]) => (
                      <li key={layer} className="text-sm">
                        <div className="flex justify-between font-mono text-xs">
                          <span>{layer}</span>
                          <span className="tabular text-fg-muted">
                            {loc} · {n(r.metrics.coverageByLayer?.[layer] ?? null, 0)}% cob.
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 rounded bg-surface-2" aria-hidden>
                          <div
                            className="h-1.5 rounded"
                            style={{ width: `${(loc / r.metrics.loc) * 100}%`, background: archById(r.id).colorVar }}
                          />
                        </div>
                      </li>
                    ))}
                </ul>
              </Card>
            ))}
          </div>
        </>
      )}

      <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wider text-fg-muted">
        Execução (atualiza a cada 5 s)
      </h2>
      <Card>
        {runtime === null ? (
          <Skeleton className="h-32" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <caption className="sr-only">Métricas de execução informadas por cada API</caption>
              <thead className="text-left text-fg-muted">
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-4 font-medium">Arquitetura</th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">Requisições</th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">Média (ms)</th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">p95 (ms)</th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">p99 (ms)</th>
                  <th scope="col" className="py-2 pr-4 text-right font-medium">RSS (MB)</th>
                  <th scope="col" className="py-2 text-right font-medium">Heap (MB)</th>
                </tr>
              </thead>
              <tbody className="tabular">
                {ARCHITECTURES.map((a) => {
                  const m = runtime.find((r) => r.id === a.id)?.metrics;
                  return (
                    <tr key={a.id} className="border-b border-border/60">
                      <th scope="row" className="py-2 pr-4 text-left font-normal">
                        <ArchBadge id={a.id} />
                      </th>
                      {m ? (
                        <>
                          <td className="py-2 pr-4 text-right">{m.requests.count}</td>
                          <td className="py-2 pr-4 text-right">{n(m.requests.meanMs, 2)}</td>
                          <td className="py-2 pr-4 text-right">{n(m.requests.p95Ms, 2)}</td>
                          <td className="py-2 pr-4 text-right">{n(m.requests.p99Ms, 2)}</td>
                          <td className="py-2 pr-4 text-right">{n(m.memory.rssMb)}</td>
                          <td className="py-2 text-right">{n(m.memory.heapUsedMb)}</td>
                        </>
                      ) : (
                        <td colSpan={6} className="py-2 text-right text-danger">
                          offline
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-fg-muted">
          Tempo medido dentro de cada API (do recebimento ao fim da resposta). Os valores zeram no início de cada teste de carga.
        </p>
      </Card>
    </>
  );
}
