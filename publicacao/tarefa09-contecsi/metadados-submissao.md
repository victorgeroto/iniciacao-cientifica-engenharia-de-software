# Metadados da submissão — 21º CONTECSI

Dados prontos para preencher no sistema de submissão
(https://contecsi.tecsi.org/index.php/contecsi/21CONTECSI/author/submit), conforme os 5 passos descritos nas Diretrizes para Autores.

> **Não versionar** CPF, ORCID, e-mails nem a senha do sistema. Esses dados são preenchidos diretamente na plataforma.
> O campo de espaços abaixo é marcado com `␣` para indicar um espaço literal; ao colar, digite os espaços.

---

## Antes de começar

- [ ] Login criado (ou reutilizado de edição anterior) no sistema do CONTECSI.
- [ ] Em **Meu Perfil**, no final da tela, a caixa **AUTOR** está marcada. Sem ela o sistema não permite submeter.
- [ ] CPF do responsável pela submissão cadastrado no perfil (obrigatório).
- [ ] ORCID dos três autores em mãos (obrigatório para todos, sem exceção).
- [ ] Template REX oficial obtido e manuscrito transposto, ou decisão registrada de enviar com as regras gerais.
- [ ] Orientadores revisaram o manuscrito e confirmaram a lista e a ordem de autores.

---

## Passo 1 — Início

| Campo | Valor |
|---|---|
| **Modalidade** | REX — Extended Abstract / Resumo Expandido (alunos de graduação) |
| **Tipo de sessão** | 09 – ESD — Engenharia e Desenvolvimento de Software e Hardware |
| **Declarações** | Marcar todas as caixas. Ver o [checklist](#checklist-das-declarações) abaixo |

## Passo 2 — Transferência do manuscrito

Arquivo: [`manuscrito/resumo-expandido.docx`](manuscrito/resumo-expandido.docx), ou a versão já transposta para o template oficial.

Antes de enviar, remover informações pessoais das propriedades do arquivo: **Arquivo → Informações → Inspecionar Documento**. O arquivo gerado já está com autor e "modificado por" vazios, mas deve ser conferido após qualquer edição no Word.

## Passo 3 — Metadados

### Autores (máximo de 4, na ordem de publicação)

| Ordem | Nome completo | Papel | Instituição | País |
|---|---|---|---|---|
| 1 | Victor Hugo Geroto Toledo | Aluno (primeiro autor e responsável pela submissão) | Centro Universitário SENAI São Paulo — UNISENAI-SP, Campus Sorocaba | Brasil |
| 2 | Deivison Shindi Takatu | Orientador | Centro Universitário SENAI São Paulo — UNISENAI-SP, Campus Sorocaba | Brasil |
| 3 | Glauco Todesco | Orientador | Centro Universitário SENAI São Paulo — UNISENAI-SP, Campus Sorocaba | Brasil |

ORCID de cada autor: colar a URL completa (`https://orcid.org/...`) no campo URL. **A confirmar com os orientadores:** grafia dos nomes e ordem.

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
This paper presents an ongoing comparative study among three widely used architectural patterns in software systems development: Monolith, Layered Architecture (MVC), and Clean Architecture. The research addresses the growing need for architectural decisions grounded in empirical evidence, since many technical decisions are still based on subjective preferences or market trends. To conduct the analysis, a tripartite prototype is proposed: the same task management application developed three times, each following a distinct architectural pattern, hosted on Amazon Web Services (AWS) cloud infrastructure, with performance metrics collected via Apache JMeter and monitored through Amazon CloudWatch and Grafana. The research is currently at the architectural specification and experimental planning stage, and the metrics collection phase has not yet been carried out. The expected contribution is a set of evidence-based guidelines for architectural pattern selection according to the project profile and organizational context.


Este trabalho apresenta um estudo comparativo em desenvolvimento entre três padrões arquiteturais amplamente utilizados no desenvolvimento de sistemas de software: Monólito, Arquitetura em Camadas (MVC) e Clean Architecture. A pesquisa aborda a necessidade de escolhas arquiteturais fundamentadas em evidências empíricas, já que muitas decisões técnicas ainda se baseiam em preferências subjetivas ou tendências de mercado. Para conduzir a análise, propõe-se um protótipo tripartido: a mesma aplicação de gerenciamento de tarefas desenvolvida três vezes, cada uma seguindo um padrão arquitetural distinto, hospedado na infraestrutura em nuvem da Amazon Web Services (AWS), com coleta de métricas de desempenho pelo Apache JMeter e monitoramento via Amazon CloudWatch e Grafana. A pesquisa encontra-se em estágio de especificação arquitetural e planejamento experimental, e a coleta de métricas ainda não foi executada. A contribuição esperada é a proposição de diretrizes baseadas em evidências para a seleção de padrões arquiteturais conforme o perfil e o contexto organizacional do projeto.
```

Inglês: 139 palavras. Português: 152 palavras. Ambos abaixo do limite de 200 palavras (1.800 caracteres).

### Indexação

| Campo | Valor |
|---|---|
| **Palavras-chave** (5 em inglês, cinco espaços, 5 em português) | `software architecture; Clean Architecture; MVC; monolith; scalability␣␣␣␣␣arquitetura de software; Clean Architecture; MVC; monólito; escalabilidade` |
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
| Texto em Word, espaço 1,5, Times New Roman 12, itálico em vez de sublinhado, figuras e tabelas no texto | ✅ Atendido pelo manuscrito atual |
| Li a seção Modalidades da Conferência (estilo e tamanho máximo) | ✅ REX: 5 a 8 páginas; manuscrito com 7 |
| O artigo não foi publicado nem está em consideração por outra conferência | ⚠️ **Conferir.** O resumo da Atividade 07, para o III Congresso UniSENAI-SP, tem conteúdo muito próximo. Confirmar com os orientadores se há impedimento e, se necessário, explicar no campo "Comentários ao diretor da conferência" |
| O texto não contém nomes dos autores e filiação, que constam nos Metadados | ✅ Atendido (verificar caso o template REX exija bloco de autores) |
| Ciência de que o autor correspondente é o único responsável pelos dados dos autores | ⬜ Declaração do autor |
| URLs ativas e clicáveis | ✅ As URLs das referências são DOIs |
| Padrões de estilo e requisitos bibliográficos (APA) | ✅ Atendido |
| Documentos Office salvos com remoção de informações pessoais | ⬜ Conferir antes do envio |
| Ciência de todas as instruções e aceite das condições | ⬜ Declaração do autor |
| Declaração de Direito Autoral (licença Creative Commons Atribuição) | ⬜ Declaração do autor |

> **Ponto de atenção — ineditismo.** O mesmo estudo foi preparado como resumo expandido para o III Congresso UniSENAI-SP (submissão até 25/09/2026, realização em 04 e 05/12/2026; ver [tarefa07-congresso.md](../tarefa07-congresso.md), que não registra o envio). As diretrizes aceitam trabalhos apresentados em outros congressos "desde que apresentem evolução em seu texto". Este manuscrito é uma reorganização do mesmo conteúdo, sem resultados novos. **Convém alinhar com os orientadores** antes de assinar a declaração de ineditismo.
