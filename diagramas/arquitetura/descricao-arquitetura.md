# Descrição da Arquitetura da Solução
**Projeto:** Comparativo Arquitetural: Monólito, Arquitetura em Camadas (MVC) e Clean Architecture em Sistemas Escaláveis  
**Aluno:** Victor Hugo Geroto Toledo  
**Instituição:** SENAI Gaspar Ricardo Junior  
**Arquivo:** `arquitetura/descricao-arquitetura.md`

---

## Por que este projeto foi escolhido?

### Contexto e Motivação

O tema definido pelo orientador — *"Modelagem Arquitetural e Boas Práticas de Engenharia de Software Aplicadas ao Desenvolvimento de Sistemas Escaláveis"* — demanda uma investigação comparativa entre padrões arquiteturais, com análise de benefícios, limitações e aplicação prática em protótipo. A escolha deste projeto responde diretamente a essa demanda científica.

A principal motivação é a ausência, na literatura, de um comparativo controlado entre os três padrões mais utilizados no mercado — **Monólito**, **Arquitetura em Camadas (MVC)** e **Clean Architecture** — implementados sobre a **mesma funcionalidade de negócio**, em **condições idênticas de hardware e infraestrutura**. Estudos como o de Blinowski et al. (2022, IEEE Access) comparam monólitos com microsserviços, mas não incluem a análise da Clean Architecture como padrão intermediário e estruturalmente coeso.

A escolha por um **protótipo tripartido** — a mesma aplicação construída três vezes — é o diferencial metodológico que transforma este trabalho de um simples projeto de desenvolvimento em uma **investigação científica com resultados mensuráveis e comparáveis**. O Dashboard Administrativo é o instrumento de pesquisa que converte dados de execução em evidências científicas.

### Hipótese Científica

> *A Clean Architecture, embora apresente maior complexidade inicial de implementação, resulta em métricas superiores de testabilidade e baixo acoplamento. A Arquitetura Monolítica oferece menor latência em ambiente de baixa carga. A Arquitetura em Camadas representa o melhor equilíbrio entre facilidade de implementação e qualidade estrutural.*

---


## Componentes da Solução

### 👤 Usuário
Acessa o sistema via navegador. Pode criar, listar, editar e deletar tarefas, além de selecionar qual arquitetura deseja utilizar e visualizar as métricas comparativas no Dashboard.

---

### 🖥 Frontend React
Interface web única, responsável por toda a interação com o usuário.

**Tecnologias:**
- React.js — biblioteca de interface
- Axios — requisições HTTP
- Recharts — gráficos do Dashboard
- Tailwind CSS — estilização

**Páginas/Componentes:**
- `TaskForm.jsx` — formulário de criação/edição de tarefas
- `TaskList.jsx` — listagem das tarefas
- `ApiSelector.jsx` — seletor da arquitetura ativa
- `Dashboard.jsx` — painel comparativo com gráficos e tabelas

---

### ⚙ API A — Arquitetura Monolítica (Porta 3001)

Implementação onde toda a lógica — rotas, regras de negócio e acesso ao banco — coexiste em um único arquivo `server.js`. Representa o modelo mais simples e serve como **baseline** da comparação.

**Estrutura interna:**
```
api-monolito/src/
└── server.js   ← rotas + lógica + banco tudo aqui
```

**Métricas esperadas:** menor latência em máquina única, menor cobertura de testes, maior acoplamento.

---

### ⚙ API B — Arquitetura em Camadas / MVC (Porta 3002)

Implementação separada em quatro camadas horizontais formalmente definidas.

**Estrutura interna:**
```
api-camadas/src/
├── controllers/    ← recebe requisições HTTP → TaskController.js
├── services/       ← regras de negócio       → TaskService.js
├── repositories/   ← acesso ao banco         → TaskRepository.js
└── models/         ← estrutura de dados      → Task.js
```

**Métricas esperadas:** manutenibilidade superior ao monólito, cobertura de testes média, acoplamento controlado.

---

### ⚙ API C — Clean Architecture (Porta 3003)

Implementação baseada nos princípios de Robert C. Martin com camadas concêntricas e inversão de dependências.

**Estrutura interna:**
```
api-clean/src/
├── domain/
│   ├── entities/      ← Task.js (objeto puro, sem dependências)
│   └── usecases/      ← CreateTask.js, ListTasks.js, UpdateTask.js, DeleteTask.js
├── infrastructure/
│   ├── database/      ← SQLiteTaskRepository.js
│   ├── http/          ← server.js, routes/
│   └── logger/        ← Logger.js
└── interfaces/
    └── controllers/   ← TaskController.js (adapta HTTP → usecase)
```

**Métricas esperadas:** maior testabilidade, menor acoplamento, maior complexidade inicial de implementação.

---

### 🗄 Banco de Dados — SQLite (A, B e C)

Cada API possui seu próprio banco SQLite isolado, garantindo que não haja interferência entre as instâncias durante os experimentos. O SQLite foi escolhido por sua leveza e por eliminar variáveis externas de configuração de banco.

**Tabela comum às três versões:**
```sql
CREATE TABLE tasks (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  title     TEXT NOT NULL,
  done      BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### 📊 Dashboard Administrativo

Painel integrado ao frontend que coleta métricas via endpoint `GET /metrics` de cada API e exibe comparações visuais em tempo real.

**Métricas exibidas:**

| Métrica | Descrição | Como é coletada |
|---------|-----------|-----------------|
| Tempo médio de resposta (ms) | Latência média de cada endpoint | Middleware de timing em cada API |
| Throughput (req/s) | Requisições processadas por segundo | Teste de carga com autocannon |
| Linhas de código | Volume de código por camada | Análise estática com `cloc` |
| Cobertura de testes (%) | % de código coberto por testes | Jest + nyc/c8 |
| Número de dependências | Acoplamento entre módulos | Análise de imports |
| Tamanho do projeto (KB) | Footprint de cada versão | `du -sh` |

---

## Infraestrutura e Nuvem

### Docker Compose (Ambiente Local)
```yaml
services:
  frontend:
    build: ./frontend
    ports: ["5173:5173"]

  api-monolito:
    build: ./api-monolito
    ports: ["3001:3001"]

  api-camadas:
    build: ./api-camadas
    ports: ["3002:3002"]

  api-clean:
    build: ./api-clean
    ports: ["3003:3003"]
```

### AWS (Deploy em Nuvem)
Conforme recomendação do orientador:

- **AWS EC2** — três instâncias separadas, uma por arquitetura
- **GitHub Actions** — pipeline CI/CD com testes automatizados e deploy automatizado
- **AWS Elastic Load Balancer** — demonstração de escalabilidade horizontal para API B e C
- **Auto Scaling Group** — evidência prática de escalabilidade por padrão arquitetural

---

## Estrutura Completa do Repositório

```
projeto-ic/
│
├── frontend/                     ← React (UI + Dashboard)
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── ApiSelector.jsx
│   │   │   └── Dashboard.jsx
│   │   └── services/
│   │       └── api.js
│   └── package.json
│
├── api-monolito/                 ← API A (Porta 3001)
│   └── src/
│       └── server.js
│
├── api-camadas/                  ← API B (Porta 3002)
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       └── models/
│
├── api-clean/                    ← API C (Porta 3003)
│   └── src/
│       ├── domain/
│       │   ├── entities/
│       │   └── usecases/
│       ├── infrastructure/
│       └── interfaces/
│
├── docker/
│   └── docker-compose.yml
│
├── .github/
│   └── workflows/
│       └── ci.yml               ← GitHub Actions CI/CD
│
├── docs/
├── arquitetura/
│   ├── descricao-arquitetura.md ← este arquivo
│   └── diagrama.png             ← diagrama exportado
├── referencias/
│   └── tarefa04-referencias.md
└── README.md
```