# Metadados da submissão — 21º CONTECSI

Dados prontos para preencher no sistema de submissão
(https://contecsi.tecsi.org/index.php/contecsi/21CONTECSI/author/submit), conforme os 5 passos descritos nas Diretrizes para Autores.

> **Não versionar** CPF, ORCID, e-mails nem a senha do sistema. Esses dados são preenchidos diretamente na plataforma e no `.docx` local.
> O símbolo `␣` indica um espaço literal; ao colar, digite os espaços.

---

## Antes de começar

- [ ] Login criado (ou reutilizado de edição anterior) no sistema do CONTECSI.
- [ ] Em **Meu Perfil**, no final da tela, a caixa **AUTOR** está marcada. Sem ela o sistema não permite submeter.
- [ ] CPF do responsável pela submissão cadastrado no perfil (obrigatório).
- [ ] ORCID dos três autores em mãos (obrigatório para todos, sem exceção).
- [ ] Coordenação consultada sobre qual formato vale (template × Diretrizes; ver o [README](README.md#divergências-entre-o-template-e-as-diretrizes-do-21º-contecsi)).
- [ ] Campos `[preencher]` do bloco de autores completados no `.docx` local, se for enviada a versão com autores.
- [ ] Orientadores revisaram o manuscrito e confirmaram a lista e a ordem de autores.

---

## Passo 1 — Início

| Campo | Valor |
|---|---|
| **Modalidade** | REX — Extended Abstract / Resumo Expandido (alunos de graduação) |
| **Tipo de sessão** | 09 – ESD — Engenharia e Desenvolvimento de Software e Hardware |
| **Declarações** | Marcar todas as caixas. Ver o [checklist](#checklist-das-declarações) abaixo |

## Passo 2 — Transferência do manuscrito

Arquivo: [`manuscrito/resumo-expandido.docx`](manuscrito/resumo-expandido.docx) (template, com autores) ou [`manuscrito/resumo-expandido-sem-autores.docx`](manuscrito/resumo-expandido-sem-autores.docx), conforme a resposta da coordenação.

Antes de enviar, remover informações pessoais das propriedades do arquivo: **Arquivo → Informações → Inspecionar Documento**. Os arquivos gerados já estão com autor e "modificado por" vazios, mas isso deve ser conferido após qualquer edição no Word.

## Passo 3 — Metadados

### Autores (máximo de 4, na ordem de publicação)

| Ordem | Nome completo | Papel | Instituição | País |
|---|---|---|---|---|
| 1 | Victor Hugo Geroto Toledo | Aluno (primeiro autor e responsável pela submissão) | Centro Universitário SENAI São Paulo — UNISENAI-SP, Campus Sorocaba | Brasil |
| 2 | Deivison Shindi Takatu | Orientador | Centro Universitário SENAI São Paulo — UNISENAI-SP, Campus Sorocaba | Brasil |
| 3 | Glauco Todesco | Orientador | Centro Universitário SENAI São Paulo — UNISENAI-SP, Campus Sorocaba | Brasil |

ORCID de cada autor: colar a URL completa (`https://orcid.org/...`) no campo URL. **A confirmar com os orientadores:** grafia dos nomes e ordem. No manuscrito, ambos constam como "Orientador" (o template tem também o campo "Co-orientador", não usado).

O sistema chama todos de "autor"; não existe o termo "coautor".

### Resumo da biografia (um por autor)

**1 — Victor Hugo Geroto Toledo.** Graduando em Análise e Desenvolvimento de Sistemas pelo Centro Universitário SENAI São Paulo (UNISENAI-SP), Campus Sorocaba. Desenvolve pesquisa de Iniciação Científica sobre padrões arquiteturais de software aplicados a sistemas escaláveis.

**2 — Deivison Shindi Takatu.** Mestre em Ciência da Computação pela Universidade Federal de São Carlos (UFSCar), Campus Sorocaba, e Especialista em Informática Aplicada à Educação pelo IFSP, Campus Itapetininga. Professor universitário.

**3 — Glauco Todesco.** Doutor em Engenharia Elétrica pela Universidade de São Paulo (2006) e Mestre em Ciência da Computação pela UFSCar (2000). Professor de graduação em cursos de computação e pesquisador.

*(As biografias dos orientadores reaproveitam as já registradas em [tarefa07-congresso.md](../tarefa07-congresso.md); pedir a eles que confirmem.)*

### Título (campo único)

Título em inglês, em **MAIÚSCULAS**, cinco espaços, título em português:

```
ARCHITECTURAL COMPARISON: MONOLITH, LAYERED ARCHITECTURE (MVC) AND CLEAN ARCHITECTURE IN SCALABLE SYSTEMS␣␣␣␣␣COMPARATIVO ARQUITETURAL: MONÓLITO, ARQUITETURA EM CAMADAS (MVC) E CLEAN ARCHITECTURE EM SISTEMAS ESCALÁVEIS
```

### Resumo (campo único: inglês, dois parágrafos de separação, português)

```
This work aims to compare, quantitatively and qualitatively, the performance, integration and maintainability of software systems structured in three architectural patterns: Monolith, Layered Architecture (MVC) and Clean Architecture. The methodology consists of a tripartite prototype, in which the same task management application is developed three times, keeping the domain, the language (TypeScript with Node.js), the database (PostgreSQL) and the Amazon Web Services (AWS) cloud infrastructure constant, with load controlled by Apache JMeter and monitoring via Amazon CloudWatch and Grafana. The research is ongoing, at the architectural specification and experimental planning stage; metrics collection has not yet been carried out and there are no consolidated quantitative results. As partial results, the gap in the literature, which mostly compares monoliths and microservices, was delimited, and the hypothesis was formulated that Clean Architecture will show better testability and lower coupling, while the Monolith will show lower latency under low load. The expected outcome is a set of evidence-based guidelines for selecting the architectural pattern according to the project context.


Este trabalho tem como objetivo comparar, de forma quantitativa e qualitativa, o desempenho, a integração e a manutenibilidade de sistemas de software estruturados em três padrões arquiteturais: Monólito, Arquitetura em Camadas (MVC) e Clean Architecture. A metodologia consiste em um protótipo tripartido, no qual a mesma aplicação de gerenciamento de tarefas é desenvolvida três vezes, mantendo constantes o domínio, a linguagem (TypeScript com Node.js), o banco de dados (PostgreSQL) e a infraestrutura em nuvem da Amazon Web Services (AWS), com carga controlada pelo Apache JMeter e monitoramento via Amazon CloudWatch e Grafana. A pesquisa está em andamento, em estágio de especificação arquitetural e planejamento experimental; a coleta de métricas ainda não foi executada e não há resultados quantitativos consolidados. Como resultados parciais, delimitou-se a lacuna da literatura, que compara majoritariamente monólitos e microsserviços, e formulou-se a hipótese de que a Clean Architecture apresentará melhor testabilidade e menor acoplamento, enquanto o Monólito terá menor latência em baixa carga. Espera-se produzir diretrizes baseadas em evidências para a seleção do padrão arquitetural conforme o contexto do projeto.
```

Resumo em português com 174 palavras; limite do template: 250.

### Indexação

| Campo | Valor |
|---|---|
| **Palavras-chave** (5 em inglês, cinco espaços, 5 em português) | `Cloud Computing; Maintainability; Performance; Scalability; Software Architecture␣␣␣␣␣Arquitetura de Software; Computação em Nuvem; Desempenho; Escalabilidade; Manutenibilidade` |
| **Idioma** | Português (com título e resumo também em inglês) |
| **Agências de fomento** | A definir com os orientadores se o apoio institucional deve ser informado. O manuscrito não declara financiamento |

## Passo 4 — Documentos suplementares

Nenhum. Só é necessário se a coordenação solicitar.

## Passo 5 — Confirmação

Concluir a submissão e **salvar o código numérico de 4 dígitos**. Esse código deve constar em qualquer comunicação com a coordenação. Registrar aqui e no [README](README.md):

| Item | Valor |
|---|---|
| Data da submissão | — |
| Código de identificação (4 dígitos) | — |
| E-mail de confirmação do sistema | — |

---

## Checklist das declarações

Itens que o formulário do Passo 1 exige marcar. Marcar apenas o que for verdadeiro no momento do envio.

| Declaração | Situação |
|---|---|
| Texto em Word, espaço 1,5, Times New Roman 12, itálico em vez de sublinhado, figuras e tabelas no texto | ⚠️ **Divergência:** o manuscrito usa Arial 12, conforme o template. Se a coordenação exigir Times New Roman, trocar a fonte do documento. Demais itens atendidos |
| Li a seção Modalidades da Conferência (estilo e tamanho máximo) | ✅ REX: 5 a 8 páginas; manuscrito com 6 |
| O artigo não foi publicado nem está em consideração por outra conferência | ⚠️ **Conferir.** O resumo da Atividade 07, para o III Congresso UniSENAI-SP, tem conteúdo muito próximo. Confirmar com os orientadores se há impedimento e, se necessário, explicar no campo "Comentários ao diretor da conferência" |
| O texto não contém os nomes dos autores e filiação, que constam nos Metadados | ⚠️ Atendido apenas pela versão `-sem-autores`. A versão do template traz o bloco de autores |
| Ciência de que o autor correspondente é o único responsável pelos dados dos autores | ⬜ Declaração do autor |
| URLs ativas e clicáveis | ✅ As URLs das referências são DOIs |
| Padrões de estilo e requisitos bibliográficos | ⚠️ **Divergência:** o manuscrito usa ABNT, conforme o template; as Diretrizes citam APA. Confirmar com a coordenação |
| Documentos Office salvos com remoção de informações pessoais | ⬜ Conferir antes do envio |
| Ciência de todas as instruções e aceite das condições | ⬜ Declaração do autor |
| Declaração de Direito Autoral (licença Creative Commons Atribuição) | ⬜ Declaração do autor |

> **Ponto de atenção — ineditismo.** O mesmo estudo foi preparado como resumo expandido para o III Congresso UniSENAI-SP (submissão até 25/09/2026, realização em 04 e 05/12/2026; ver [tarefa07-congresso.md](../tarefa07-congresso.md), que não registra o envio). As diretrizes aceitam trabalhos apresentados em outros congressos "desde que apresentem evolução em seu texto". Este manuscrito é uma reorganização do mesmo conteúdo, sem resultados novos. **Convém alinhar com os orientadores** antes de assinar a declaração de ineditismo.
