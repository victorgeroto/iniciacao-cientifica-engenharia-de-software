# Comparativo Arquitetural: Monólito, Arquitetura em Camadas (MVC) e Clean Architecture em Sistemas Escaláveis

**Aluno:** Victor Hugo Geroto Toledo  
**Instituição:** Centro Universitário SENAI São Paulo — UNISENAI-SP Campus Sorocaba  
**Curso:** Graduação em Análise e Desenvolvimento de Sistemas  
**Disciplina:** Iniciação Científica  
**Orientador:** Deivison Takatu  

---

## Descrição da Proposta

Este projeto apresenta um estudo comparativo entre três padrões arquiteturais amplamente utilizados no desenvolvimento de sistemas de software: **Monólito**, **Arquitetura em Camadas (MVC)** e **Clean Architecture**. A pesquisa aborda a crescente necessidade de escolhas arquiteturais fundamentadas em evidências empíricas, propondo a implementação de um **protótipo tripartido** — a mesma aplicação de gerenciamento de tarefas desenvolvida três vezes, cada uma seguindo um padrão distinto — hospedado na infraestrutura em nuvem da **Amazon Web Services (AWS)**.

O estudo coleta métricas objetivas de desempenho, qualidade de código e manutenibilidade, comparando os resultados com as predições da literatura científica.

---

## Objetivos

### Objetivo Geral
Analisar quantitativa e qualitativamente o desempenho, a integração e a manutenibilidade de sistemas de software criados com base em três padrões arquiteturais (Monólito, MVC e Clean Architecture), por meio de um protótipo funcional comparativo hospedado na AWS.

### Objetivos Específicos
- Implementar a mesma aplicação de gerenciamento de tarefas em três versões com arquiteturas distintas
- Coletar métricas objetivas de desempenho (tempo de resposta, throughput, uso de memória)
- Medir indicadores de qualidade de código (cobertura de testes, dependências entre módulos, linhas de código por camada)
- Comparar os resultados com as predições da literatura científica
- Propor recomendações práticas baseadas em evidências para a seleção de padrões arquiteturais

---

## Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|-----------|
| **Linguagem** | TypeScript / Node.js |
| **Front-end** | React + TypeScript |
| **Back-end** | Node.js com Express |
| **Banco de Dados** | PostgreSQL |
| **Autenticação** | JSON Web Tokens (JWT) |
| **Containerização** | Docker |
| **Nuvem** | Amazon Web Services (AWS) |
| **Computação** | Amazon EC2 / Amazon ECS |
| **Banco Gerenciado** | Amazon RDS (PostgreSQL) |
| **Armazenamento** | Amazon S3 |
| **Segurança** | AWS IAM, AWS Certificate Manager |
| **Monitoramento** | Amazon CloudWatch |

---

## Arquitetura da Solução

A arquitetura consiste em três implementações paralelas da mesma aplicação, cada uma seguindo um padrão arquitetural distinto:

### Versão Monolítica
Todos os componentes (apresentação, lógica de negócio, acesso a dados) residem em um único artefato implantável com acoplamento direto entre as camadas.

### Versão MVC (Arquitetura em Camadas)
Responsabilidades separadas horizontalmente em três camadas — **Model**, **View** e **Controller** — com comunicação unidirecional entre elas.

### Versão Clean Architecture
Estrutura de camadas concêntricas conforme proposto por Robert C. Martin (2017):
- **Núcleo:** Entidades e Casos de Uso
- **Camada Intermediária:** Adaptadores de Interface
- **Camada Externa:** Frameworks e Drivers

Todas as versões compartilham a mesma infraestrutura AWS, com um serviço centralizado de coleta de métricas e um painel de visualização em tempo real.

```
┌─────────────────────────────────────────────────────┐
│                    AWS Cloud                         │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Monólito │  │   MVC    │  │Clean Architecture│  │
│  │ (Docker) │  │ (Docker) │  │    (Docker)      │  │
│  └────┬─────┘  └────┬─────┘  └───────┬──────────┘  │
│       │              │                │              │
│       └──────────────┼────────────────┘              │
│                      │                               │
│              ┌───────▼────────┐                      │
│              │  PostgreSQL    │                      │
│              │  (Amazon RDS)  │                      │
│              └───────┬────────┘                      │
│                      │                               │
│              ┌───────▼────────┐                      │
│              │  CloudWatch    │                      │
│              │  (Métricas)    │                      │
│              └────────────────┘                      │
└─────────────────────────────────────────────────────┘
```

---

## Organização do Repositório

```
/referencias          → Levantamento bibliográfico e fichamentos
/arquitetura          → Diagramas arquiteturais e modelos
/documentacao         → Documento técnico-científico (artigo)
/imagens              → Imagens e figuras utilizadas no projeto
/apresentacao         → Materiais de apresentação
README.md             → Este arquivo
```

---

## Referências Principais

1. MARTIN, R. C. **Clean Architecture: A Craftsman's Guide to Software Structure and Design**. Prentice Hall, 2017.
2. BLINOWSKI, G.; OJDOWSKA, A.; PRZYBYLEK, A. Monolithic vs. Microservice Architecture: A Performance and Scalability Evaluation. **IEEE Access**, v. 10, 2022.
3. BASS, L.; CLEMENTS, P.; KAZMAN, R. **Software Architecture in Practice**. 3. ed. Addison-Wesley, 2012.
4. GARLAN, D.; SHAW, M. An Introduction to Software Architecture. **Advances in Software Engineering and Knowledge Engineering**, 1993.
5. DRAGONI, N. et al. Microservices: Yesterday, Today, and Tomorrow. **Present and Ulterior Software Engineering**, Springer, 2017.
6. FOWLER, M. **Patterns of Enterprise Application Architecture**. Addison-Wesley, 2002.
7. NEWMAN, S. **Building Microservices: Designing Fine-Grained Systems**. O'Reilly Media, 2015.
8. RICHARDS, M. **Software Architecture Patterns**. O'Reilly Media, 2015.
9. TAPIA, B. et al. A Comparative Analysis of Monolithic and Microservice Architectures. **Applied Sciences**, v. 10, n. 17, 2020.
10. TU, X. MVC Architecture Pattern Analysis. **Journal of Software Engineering and Applications**, v. 16, n. 4, 2023.
11. AWS. **AWS Well-Architected Framework**, 2023.
12. IJCSE. DevOps and Containerization Practices in Modern Software Architecture. **International Journal of Computer Science and Engineering**, v. 12, n. 3, 2024.
---

> Projeto desenvolvido como parte da disciplina de Iniciação Científica — SENAI Gaspar Ricardo Junior, 2026.