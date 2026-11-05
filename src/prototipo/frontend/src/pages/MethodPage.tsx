import { PageHeader } from "../components/Layout";
import { ArchBadge, Card } from "../components/ui";
import { ARCHITECTURES } from "../lib/architectures";

const CONSTANTS = [
  ["Domínio", "Gerenciamento de tarefas com usuários e JWT"],
  ["Linguagem", "TypeScript sobre Node.js, mesmas versões e dependências"],
  ["Banco", "PostgreSQL 16, um banco isolado por API, mesmo esquema"],
  ["Contrato HTTP", "Mesmas rotas, validações, códigos e mensagens (verificado pelo teste e2e)"],
  ["Recursos", "1 vCPU e 512 MB por API e por banco (docker compose)"],
  ["Instrumentação", "Mesmo middleware de métricas nas três APIs"],
];

const LIMITS = [
  "Gerador de carga, APIs e bancos rodam na mesma máquina: competem por CPU. Para medições finais, rodar o gerador em outra máquina ou na AWS.",
  "A cobertura é a dos mesmos 8 casos de teste escritos sem banco em cada versão; mede o quanto cada arquitetura permite testar isoladamente, não a qualidade dos testes.",
  "Fan-out e dependências entre camadas crescem naturalmente com o número de camadas; interpretar junto com a direção das dependências.",
  "Uma rodada só não permite inferência estatística: use 3 ou mais rodadas e reporte média e desvio-padrão.",
];

export function MethodPage() {
  return (
    <>
      <PageHeader
        eyebrow="Protocolo"
        title="Método"
        description="Protótipo tripartido: a mesma aplicação construída três vezes, variando apenas o padrão arquitetural."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {ARCHITECTURES.map((a) => (
          <Card key={a.id} title={<ArchBadge id={a.id} />}>
            <p className="text-sm text-fg-muted">{a.summary}</p>
            <ul className="mt-3 flex flex-col gap-1 font-mono text-xs">
              {a.structure.map((s) => (
                <li key={s} className="rounded bg-bg px-2 py-1">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-xs text-fg-muted">porta {a.port}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Variáveis mantidas constantes">
          <dl className="flex flex-col divide-y divide-border text-sm">
            {CONSTANTS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-3 py-2">
                <dt className="font-medium">{k}</dt>
                <dd className="text-fg-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card title="Procedimento do teste de carga">
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-fg-muted">
            <li>Cria um usuário exclusivo e as tarefas de semente na API.</li>
            <li>Aquece a API sem registrar resultados.</li>
            <li>Zera as métricas internas da API.</li>
            <li>Mede pelo tempo configurado com o mesmo cenário e número de conexões.</li>
            <li>Lê a latência interna e a memória informadas pela API.</li>
            <li>Repete para as outras arquiteturas, girando a ordem a cada rodada.</li>
          </ol>
        </Card>
      </div>

      <Card title="Limitações a declarar na pesquisa" className="mt-4">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-fg-muted">
          {LIMITS.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </Card>
    </>
  );
}
