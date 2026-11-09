# Protótipo tripartido

Software de pesquisa que executa o experimento do projeto **Organização interna de aplicações monolíticas: comparação experimental entre módulo único, arquitetura em camadas e Clean Architecture**.

> **Enquadramento.** As três versões são **implantadas como monólito**: cada uma é um único artefato, com seu próprio banco. O que varia é só a **organização interna do código**. O protocolo e a análise estão em [`src/experimentos`](../experimentos/README.md).

A mesma aplicação de gerenciamento de tarefas foi construída três vezes, mudando só o padrão arquitetural. Um serviço de benchmark mede as três nas mesmas condições, e a interface web mostra os resultados lado a lado.

## Como rodar

Requisito: Docker Desktop.

```bash
cd src/prototipo
docker compose up --build
```

Abra **http://localhost:8080**, crie uma conta (ela é criada nas três APIs ao mesmo tempo) e use o menu:

| Tela | O que faz |
|---|---|
| **Tarefas** | Usa a aplicação em qualquer das três arquiteturas (`?arq=monolito`, `camadas` ou `clean`) e mostra o tempo de cada requisição |
| **Métricas** | LOC por camada, acoplamento (fan-out), cobertura de testes total e da camada de negócio, latência e memória de cada API |
| **Teste de carga** | Roda o mesmo cenário nas três APIs, mostra gráficos e tabela e exporta CSV |
| **Método** | Variáveis controladas, procedimento e limitações |

Os resultados dos testes de carga são gravados em [`data/bruto/carga/`](../../data/bruto/carga/), na raiz do repositório.

## Estrutura

```text
src/prototipo/
├── docker-compose.yml        3 PostgreSQL + 3 APIs + bench + frontend
├── backend/                  workspace npm (TypeScript)
│   ├── shared/               instrumentação de métricas (idêntica nas 3 APIs)
│   ├── api-monolito/  :3001  A · módulo único (Transaction Script): tudo em src/server.ts
│   ├── api-camadas/   :3002  B · camadas: controllers → services → repositories
│   ├── api-clean/     :3003  C · Clean Architecture: domain ← interfaces ← infrastructure
│   ├── bench/         :3000  teste de carga (autocannon) e métricas de código
│   └── jmeter/               plano-carga.jmx, para replicar com Apache JMeter
└── frontend/          :8080  React + TypeScript + Vite + Tailwind + Recharts + Axios
```

As estruturas seguem [`diagramas/arquitetura/descricao-arquitetura.md`](../../diagramas/arquitetura/descricao-arquitetura.md). Há uma diferença deliberada: o banco é **PostgreSQL**, e não SQLite. Continua havendo um banco por API.

## O que é mantido constante

- **Domínio:** tarefas com usuários e autenticação JWT.
- **Contrato HTTP:** mesmas rotas, validações, códigos e mensagens. O teste e2e `npm run test:e2e` executa o mesmo roteiro nas três APIs e exige respostas idênticas.
- **Plataforma:** Node 22, as mesmas dependências e a mesma imagem Docker.
- **Banco:** PostgreSQL 16, um por API, com o mesmo esquema.
- **Recursos:** 1 vCPU e 512 MB para cada API e cada banco.
- **Instrumentação:** o mesmo middleware de métricas (`backend/shared`), o único código compartilhado.

## Desenvolvimento sem Docker para as APIs

```bash
# só os bancos
docker compose up -d db-monolito db-camadas db-clean

cd backend
npm install
npm run build -w shared
npx tsx api-monolito/src/server.ts &   # e o mesmo para camadas e clean
npx tsx bench/src/server.ts &

cd ../frontend
npm install
npm run dev                            # http://localhost:5173
```

Comandos úteis em `backend/`:

| Comando | O que faz |
|---|---|
| `npm run typecheck` | Checagem de tipos das quatro partes |
| `npm test` | Testes de unidade (os mesmos 8 casos nas três APIs, mais os do bench) |
| `npm run coverage` | Gera a cobertura que a tela Métricas lê |
| `npm run test:e2e` | Equivalência funcional contra as APIs em execução |

## Replicar com JMeter

```bash
jmeter -n -t backend/jmeter/plano-carga.jmx -JPORT=3001 -JTHREADS=10 -JDURATION=30 -l monolito.jtl -e -o relatorio-monolito
```

Repita com `-JPORT=3002` e `-JPORT=3003`. O plano cria um usuário e 20 tarefas e mede `GET /tasks`, igual ao cenário "Listar tarefas" do bench.

## Como as métricas são calculadas

| Métrica | Definição |
|---|---|
| LOC | Linhas não vazias que não são só comentário, em `src/` |
| Camada | Primeira pasta abaixo de `src/`; `raiz` para arquivos soltos |
| Fan-out | Imports internos (relativos) por arquivo |
| Dependências entre camadas | Imports que atravessam camadas |
| Cobertura total | Linhas cobertas pelos testes de unidade, sobre todo o `src/` |
| Cobertura de negócio | Mesma cobertura, só na camada de regra de negócio (Módulo único: o arquivo inteiro · Camadas: `services/` · Clean: `domain/`) |
| Throughput e latência | Medidos pelo autocannon, com aquecimento antes e métricas do servidor zeradas |
| Latência interna e memória | Informadas por cada API em `GET /metrics` |

**Testes de unidade:** cada API tem os mesmos 8 casos de comportamento, escritos sem banco real e do jeito natural de cada organização.

- **Módulo único:** intercepta `pool.query` e testa via HTTP, porque não há ponto de injeção.
- **Camadas:** um repositório falso entra pelo construtor do service.
- **Clean:** implementações em memória das portas.

## Limitações

- O gerador de carga, as APIs e os bancos rodam na mesma máquina e disputam CPU. Para resultados finais, rode o gerador em outra máquina ou na AWS.
- Use 3 rodadas ou mais. Uma rodada só não permite comparar com segurança.
- A cobertura total penaliza arquiteturas com mais código de infraestrutura. Por isso a cobertura de negócio é mostrada separadamente.
- O fan-out cresce com o número de camadas. Interprete o valor junto com a direção das dependências.
