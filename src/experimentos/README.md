# Experimentos

Scripts que executam e analisam o experimento do projeto, a partir do protótipo em [`src/prototipo`](../prototipo/).

## Objeto de estudo

As três versões do protótipo são **implantadas como monólito**: cada uma é um único artefato executável, com seu próprio banco. O que varia entre elas é apenas a **organização interna do código**.

| Versão | Organização interna | Referência |
|---|---|---|
| A — Módulo único | *Transaction Script*: rotas, regras, SQL e autenticação em um só módulo | Fowler (2002) |
| B — Camadas (MVC) | controller → service → repository; cada camada depende da camada inferior | Fowler (2002); Richards (2015) |
| C — Clean Architecture | domínio isolado (entidades, casos de uso, portas); a infraestrutura depende do domínio | Martin (2017) |

Por isso a comparação não opõe "monólito × MVC × Clean". Monólito descreve a forma de implantação e é comum às três versões; arquitetura em camadas (MVC) e Clean Architecture são formas de estruturação interna, e uma aplicação monolítica pode adotar qualquer uma delas, ou nenhuma (módulo único).

## Questões de pesquisa

| QP | Pergunta | Característica (ISO/IEC 25010) |
|---|---|---|
| QP1 | A organização interna altera latência, throughput e custo de CPU por requisição sob a mesma carga? | Eficiência de desempenho |
| QP2 | Altera o comportamento com carga crescente e com mais CPU (escala vertical)? | Flexibilidade — escalabilidade |
| QP3 | Altera tamanho, acoplamento, dependência de infraestrutura na regra de negócio e testabilidade isolada? | Manutenibilidade — modularidade e testabilidade |
| QP4 | Altera o esforço necessário para aplicar mudanças típicas? | Manutenibilidade — modificabilidade |

## Variáveis

- **Independente:** a organização interna, com três níveis (A, B e C).
- **Mantidas constantes:** domínio, contrato HTTP (verificado por teste e2e), linguagem e versões (Node 22, TypeScript), dependências, PostgreSQL 16 (um banco por API), imagem Docker, limites de recursos (512 MB; 1 vCPU, exceto na fase vertical) e instrumentação.
- **Dependentes:** ver a tabela de operacionalização abaixo.

## Operacionalização

| Dimensão | Métrica | Instrumento |
|---|---|---|
| Desempenho | throughput (req/s); latência média e p99 (ms) | autocannon (cliente) |
| Desempenho | CPU do servidor por requisição (ms); memória RSS (MB) | `process.cpuUsage` e `process.memoryUsage` em `GET /metrics` |
| Escalabilidade de carga | throughput e latência p99 com 1, 10, 25, 50 e 100 conexões | autocannon |
| Escalabilidade vertical | throughput com 0,5, 1 e 2 vCPU por API; *speedup* em relação a 1 vCPU | limite `cpus` do Docker |
| Modularidade | LOC; arquivos; fan-out médio; dependências entre camadas | análise estática (`bench/src/codeMetrics.ts`) |
| Modularidade | % de arquivos da camada de negócio que importam frameworks ou drivers (express, pg, bcryptjs, jsonwebtoken) | `analisar_resultados.py` |
| Testabilidade | cobertura de linhas dos mesmos 8 casos de teste executados **sem banco**, no total e na camada de negócio | Vitest + V8 |
| Modificabilidade | arquivos de código e de teste alterados, linhas alteradas e camadas tocadas por cenário de mudança | `git diff --numstat` (método de cenários, ALMA) |

## Protocolo de desempenho e escalabilidade

`executar_experimento.py` reinicia o ambiente com bancos vazios e executa:

| Fase | Condições | Fixos |
|---|---|---|
| 1. Cenários | listar, buscar, criar, misto (buscar + criar) | 10 conexões, 1 vCPU |
| 2. Carga | 1, 10, 25, 50, 100 conexões | listar, 1 vCPU |
| 3. Vertical | 0,5, 1, 2 vCPU por API | listar, 25 conexões |

Cada medição segue os mesmos passos, em todas as condições:

1. Cria um usuário novo e 20 tarefas de semente.
2. Aquece por 3 s.
3. Zera as métricas do servidor.
4. Mede por 10 s.
5. Lê CPU e memória do servidor.

São **5 rodadas** por condição, com a ordem das versões rotacionada a cada rodada. O resultado são 180 medições ao todo.

## Cenários de mudança (modificabilidade)

As mesmas três mudanças foram aplicadas a partir do código-base de cada versão. Os patches completos estão em [`data/bruto/mudancas/`](../../data/bruto/mudancas/):

- **M1:** novo atributo opcional `dueDate` (data de vencimento).
- **M2:** nova regra de negócio, com no máximo 3 tarefas em andamento por usuário (HTTP 409 ao exceder).
- **M3:** troca de tecnologia, substituindo bcryptjs por scrypt nativo do Node para senhas.

## Análise estatística

`analisar_resultados.py` gera os resultados sem supor distribuição normal, porque as amostras são pequenas (n = 5 por grupo):

- **Descritiva:** média, desvio-padrão, IC 95% (t de Student) e coeficiente de variação.
- **Teste global:** Kruskal-Wallis, com tamanho de efeito ε².
- **Comparações par a par:** Mann-Whitney com p-valor exato por permutação, ajuste de Holm para três comparações e delta de Cliff como tamanho de efeito.

O nível de significância é 0,05.

## Como reproduzir

```bash
# na raiz do repositório, com o Docker Desktop aberto (~45 min)
python src/experimentos/executar_experimento.py
python src/experimentos/analisar_resultados.py      # requer matplotlib para as figuras
```

| Pasta | Conteúdo |
|---|---|
| `data/bruto/experimento/` | Uma execução por condição (JSON) e os metadados do ambiente |
| `data/bruto/mudancas/` | Patches e `numstat` dos cenários M1–M3 |
| `data/tratado/` | Tabelas (CSV) e figuras (PNG) usadas nos documentos |

## Limitações conhecidas

- **Mesma máquina:** gerador de carga, APIs e bancos compartilham o mesmo hospedeiro. Os limites do Docker isolam CPU e memória das APIs, mas não a disputa por cache e memória do hospedeiro.
- **Escala:** a aplicação é pequena e o domínio é simples. Os resultados não se generalizam diretamente para sistemas grandes.
- **Implementação única:** cada organização foi implementada uma vez, pelo mesmo autor. Outra implementação de cada estilo poderia produzir números diferentes.
- **Escala horizontal:** não foi avaliada (várias réplicas atrás de um balanceador). Fica como trabalho futuro.
