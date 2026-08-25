# Pesquisa de Periódicos e Eventos Científicos — Atividade 06

**Projeto:** Comparativo Arquitetural: Monólito, Arquitetura em Camadas (MVC) e Clean Architecture em Sistemas Escaláveis
**Aluno:** Victor Hugo Geroto Toledo
**Instituição:** Centro Universitário SENAI São Paulo — UNISENAI-SP, Campus Sorocaba
**Curso:** Graduação em Análise e Desenvolvimento de Sistemas
**Orientador:** Deivison Takatu
**Data:** 20/08/2026

---

## Contextualização — o tema e o espaço de publicação correspondente

A Iniciação Científica em andamento é uma **pesquisa empírica experimental**: implementa a mesma aplicação de gerenciamento de tarefas três vezes (Monólito, Arquitetura em Camadas/MVC e Clean Architecture), mantendo constantes o domínio de negócio, a linguagem (TypeScript/Node.js), o banco (PostgreSQL) e a infraestrutura (AWS), para coletar métricas objetivas de desempenho (tempo de resposta, *throughput*, uso de memória) e de qualidade de código (cobertura de testes, dependências entre módulos, LOC por camada).

Essa natureza — comparação controlada de padrões arquiteturais com medição quantitativa — define os descritores utilizados para localizar os veículos de publicação:

| Eixo do projeto | Descritores de busca |
|---|---|
| Objeto de estudo | `software architecture`, `architectural patterns`, `layered architecture`, `clean architecture`, `monolith` |
| Método | `empirical study`, `performance evaluation`, `benchmarking`, `controlled experiment`, `comparative study` |
| Atributos medidos | `scalability`, `maintainability`, `testability`, `coupling`, `latency`, `throughput` |
| Contexto de execução | `cloud computing`, `containerization`, `DevOps`, `AWS` |

A partir desses descritores, a pesquisa foi conduzida no **Google Acadêmico**, **IEEE Xplore**, **ACM Digital Library**, **ScienceDirect (Elsevier)**, **MDPI**, **SOL — Biblioteca Digital da SBC** e nos sites oficiais dos eventos.

---

## PARTE 1 — Formas de Divulgação Científica

### 1.1 Artigo científico (periódico)

**O que é.** Texto completo submetido a um periódico científico e avaliado por pares (*peer review*), normalmente em processo de múltiplas rodadas com possibilidade de revisão maior ou menor antes do aceite. É a unidade de publicação de maior peso na avaliação acadêmica.

**Para que serve.** Registrar de forma definitiva e citável uma contribuição original ao conhecimento, com detalhamento metodológico suficiente para que outros pesquisadores possam reproduzir o estudo. Diferentemente de um congresso, o periódico não tem limite rígido de páginas nem prazo único no ano — o fluxo de submissão é contínuo.

**Que tipo de trabalho costuma ser apresentado.** Pesquisas concluídas e maduras: estudos empíricos com resultados consolidados, revisões sistemáticas de literatura, estudos de mapeamento, propostas de método ou modelo com validação. Em Engenharia de Software, é comum a exigência explícita de evidência empírica — o *Journal of Systems and Software*, por exemplo, determina que todo artigo apresente evidência de sustentação de suas afirmações, por estudo empírico, simulação ou prova formal.

**Onde encontrar.** Bases indexadoras e bibliotecas digitais das editoras: IEEE Xplore, ACM Digital Library, ScienceDirect (Elsevier), SpringerLink, MDPI, Wiley Online Library, SciELO, Portal de Periódicos CAPES e Google Acadêmico.

**Relação com esta IC.** É o formato-alvo final da pesquisa, após a coleta completa das métricas nas três versões do protótipo.

---

### 1.2 Artigo completo em congresso (*full paper*)

**O que é.** Artigo com extensão média de 8 a 12 páginas, submetido a uma chamada de trabalhos (*call for papers*) com prazo fechado, avaliado por membros de um Comitê de Programa — em geral três pareceristas por submissão, frequentemente em modalidade duplo-cega (*double-blind*), em que autores e revisores se desconhecem mutuamente.

**Para que serve.** Publicar e discutir resultados de pesquisa em um prazo muito mais curto do que o de um periódico, com apresentação oral presencial que gera *feedback* imediato da comunidade. Em Computação, ao contrário de outras áreas, congressos de primeira linha têm prestígio equivalente ou superior a periódicos.

**Que tipo de trabalho costuma ser apresentado.** Pesquisa original com resultados já obtidos, ainda que parciais; estudos experimentais; propostas de técnica ou ferramenta com avaliação inicial. Muitos eventos mantêm trilhas paralelas para trabalhos em estágios diferentes — no ICSA 2026, por exemplo, a trilha *New and Emerging Ideas* aceita submissões de até 5 páginas para ideias ainda em amadurecimento, e a trilha *Software Architecture in Practice* aceita artigos de 4 a 8 páginas.

**Onde encontrar.** Nos **anais** (*proceedings*) do evento, que recebem ISBN/DOI e são indexados: IEEE Xplore (eventos IEEE), ACM Digital Library (eventos ACM), SpringerLink (série LNCS) e a **SOL — Biblioteca Digital da SBC** (eventos brasileiros).

**Relação com esta IC.** É o formato mais realista para a primeira publicação da pesquisa, quando as métricas de pelo menos duas das três versões estiverem coletadas.

---

### 1.3 Pôster científico

**O que é.** Apresentação visual sintética da pesquisa — problema, método, resultados parciais e conclusões — exibida em painel durante uma sessão específica do evento, em que o autor permanece ao lado do pôster dialogando individualmente com os participantes. Costuma ser acompanhada de um resumo ou artigo curto (2 a 4 páginas) nos anais.

**Para que serve.** Divulgar pesquisa em andamento e obter retorno qualificado antes de a investigação estar concluída. A sessão de pôsteres é o formato com maior densidade de conversas técnicas por hora de evento, o que a torna especialmente valiosa para quem está definindo ou ajustando a metodologia.

**Que tipo de trabalho costuma ser apresentado.** Pesquisas em estágio inicial ou intermediário, resultados preliminares, trabalhos de Iniciação Científica, propostas de projeto de mestrado e doutorado. No **Concurso de Trabalhos de Iniciação Científica do CBSoft**, a Mostra de Trabalhos ocorre justamente em formato de sessão de pôsteres, e a participação nela é pré-requisito para a apresentação oral e, por consequência, para concorrer à premiação.

**Onde encontrar.** Nos anais do evento (quando há resumo publicado), nas páginas de programação dos congressos e nos repositórios institucionais das universidades, que frequentemente arquivam os pôsteres de suas mostras de IC.

**Relação com esta IC.** É o formato adequado ao estágio atual da pesquisa — o protótipo tripartido está especificado e a arquitetura definida, mas a coleta de métricas ainda não foi concluída.

---

### 1.4 Simpósio *(modalidade escolhida livremente)*

**O que é.** Evento científico de escopo temático mais estreito e delimitado que um congresso geral, reunindo pesquisadores de uma subárea específica. Frequentemente é organizado dentro de um congresso maior que agrega vários simpósios coirmãos. É o caso do **CBSoft — Congresso Brasileiro de Software: Teoria e Prática**, que integra quatro eventos tradicionais da comunidade brasileira de Engenharia de Software, entre eles o **SBCARS**, dedicado a componentes, arquiteturas e reutilização de software.

**Para que serve.** Concentrar em um mesmo espaço a comunidade que trabalha em um recorte temático específico, o que eleva a qualidade técnica da discussão: os pareceristas e a plateia dominam o assunto em profundidade. Para quem pesquisa arquitetura de software, um simpósio da subárea oferece revisão mais especializada do que um congresso amplo de Computação.

**Que tipo de trabalho costuma ser apresentado.** Artigos completos e curtos da subárea, relatos de experiência, artigos de dados (*data papers*) — o SBCARS 2026 aceita explicitamente submissões centradas em *datasets*, *benchmarks* e repositórios curados, com até 4 páginas mais 2 de referências. Simpósios brasileiros costumam aceitar submissões em português ou inglês, o que reduz a barreira de entrada para o pesquisador iniciante.

**Onde encontrar.** Nos anais publicados pela sociedade científica organizadora — no caso dos simpósios da SBC, na SOL (`sol.sbc.org.br`) — e nas páginas oficiais de cada edição.

**Relação com esta IC.** O SBCARS é o simpósio cuja ementa coincide mais diretamente com o objeto desta pesquisa, e sua aceitação de submissões em português o torna o alvo nacional mais viável.

> **Observação sobre a escolha.** As três primeiras modalidades são **formatos de trabalho** (o que se escreve); a quarta é um **tipo de veículo** (onde se publica). A escolha do Simpósio foi deliberada para cobrir as duas dimensões e por conectar diretamente com o evento identificado na Parte 3 como o mais alinhado ao tema.

---

## PARTE 2 — Periódicos Científicos

### Periódico 1 — IEEE Access

| Campo | Informação |
|---|---|
| **Nome** | IEEE Access — *A Multidisciplinary, Applied, Open-Access Journal* |
| **Instituição/editora** | Institute of Electrical and Electronics Engineers (IEEE) |
| **ISSN** | 2169-3536 (eletrônico) |
| **Área de conhecimento** | Multidisciplinar, cobrindo todos os campos de interesse do IEEE; concentração majoritária em Ciência da Computação |
| **Periodicidade / modelo** | Publicação contínua; acesso aberto (*open access*) desde a criação, em 2013, com taxa de processamento de artigo (APC) e política de isenção |
| **Qualis** | Ver **Nota 1** ao final do documento |
| **Link oficial** | https://ieeeaccess.ieee.org/ — registro no ISSN Portal: https://portal.issn.org/resource/ISSN/2169-3536 — indexação DOAJ: https://doaj.org/toc/2169-3536 |

**Principais temas publicados.** Arquitetura de software e sistemas distribuídos, computação em nuvem, avaliação de desempenho e escalabilidade, engenharia de software aplicada, aprendizado de máquina, redes e segurança.

**Exemplos de artigos relacionados ao tema desta IC:**

- BLINOWSKI, G. J.; OJDOWSKA, A.; PRZYBYŁEK, A. Monolithic vs. Microservice Architecture: A Performance and Scalability Evaluation. *IEEE Access*, v. 10, p. 20357–20374, 2022. DOI: [10.1109/ACCESS.2022.3152803](https://doi.org/10.1109/ACCESS.2022.3152803)
- VELEPUCHA, V.; FLORES, P. A Survey on Microservices Architecture: Principles, Patterns and Migration Challenges. *IEEE Access*, v. 11, p. 88339–88358, 2023. DOI: [10.1109/ACCESS.2023.3305687](https://doi.org/10.1109/ACCESS.2023.3305687)

**Por que interessa a esta IC.** É o periódico que publicou o trabalho relacionado mais direto da pesquisa (Blinowski *et al.*, 2022), cuja metodologia de comparação empírica entre padrões arquiteturais está sendo adaptada para o protótipo tripartido. Sendo de acesso aberto e multidisciplinar, tem escopo largo o suficiente para acomodar estudos comparativos aplicados como este.

---

### Periódico 2 — Journal of Systems and Software (JSS)

| Campo | Informação |
|---|---|
| **Nome** | Journal of Systems and Software |
| **Instituição/editora** | Elsevier B.V. |
| **ISSN** | 0164-1212 |
| **Área de conhecimento** | Engenharia de Software (todos os seus aspectos), independentemente do domínio de aplicação |
| **Periodicidade / modelo** | Mensal (fluxo contínuo); assinatura, com opção de acesso aberto. Fundado em 1979 |
| **Qualis** | Ver **Nota 1** |
| **Link oficial** | https://www.sciencedirect.com/journal/journal-of-systems-and-software |

**Principais temas publicados.** Sistemas de software, técnicas de especificação de alto nível, sistemas distribuídos e concorrentes, sistemas de tempo real, **métricas de software**, modelos de confiabilidade, **questões de desempenho** e temas de gestão de engenharia de software. O periódico publica artigos de pesquisa, *surveys* do estado da arte e relatos de experiência prática.

**Exigência metodológica relevante.** O JSS determina que todo artigo apresente evidência que sustente suas afirmações — por estudo empírico, simulação, prova formal ou outro tipo de validação. Essa exigência coincide exatamente com o desenho desta IC, que é empírico e baseado em medição.

**Exemplos de artigos relacionados ao tema desta IC:**

- DI FRANCESCO, P.; LAGO, P.; MALAVOLTA, I. Architecting with Microservices: A Systematic Mapping Study. *Journal of Systems and Software*, v. 150, p. 77–97, 2019. DOI: [10.1016/j.jss.2019.01.001](https://doi.org/10.1016/j.jss.2019.01.001)
- ASSUNÇÃO, W. K. G.; KRÜGER, J.; MOSSER, S.; SELAOUI, S. How do Microservices Evolve? An Empirical Analysis of Changes in Open-Source Microservice Repositories. *Journal of Systems and Software*, v. 204, art. 111788, 2023. DOI: [10.1016/j.jss.2023.111788](https://doi.org/10.1016/j.jss.2023.111788)

**Por que interessa a esta IC.** É um dos periódicos mais citados da área de Engenharia de Software e já consta no levantamento bibliográfico do projeto (Di Francesco *et al.*, 2019). Publica exatamente a combinação de temas desta pesquisa: métricas de software, desempenho e arquitetura, com exigência de validação empírica.

---

### Periódico 3 — Applied Sciences

| Campo | Informação |
|---|---|
| **Nome** | Applied Sciences |
| **Instituição/editora** | MDPI (Multidisciplinary Digital Publishing Institute), Basileia, Suíça |
| **ISSN** | 2076-3417 (eletrônico) |
| **Área de conhecimento** | Ciências aplicadas em sentido amplo; a seção *Computing and Artificial Intelligence* concentra os trabalhos de Computação |
| **Periodicidade / modelo** | Publicação contínua, com fascículos quinzenais; acesso aberto integral, revisão por pares |
| **Qualis** | Ver **Nota 1** |
| **Link oficial** | https://www.mdpi.com/journal/applsci |

**Principais temas publicados.** Aplicações de engenharia e computação com validação experimental, incluindo arquitetura de sistemas, computação em nuvem, avaliação de desempenho e estudos comparativos de tecnologias aplicadas.

**Exemplos de artigos relacionados ao tema desta IC:**

- TAPIA, F.; MORA, M. Á.; FUERTES, W.; AULES, H.; FLORES, E.; TOULKERIDIS, T. From Monolithic Systems to Microservices: A Comparative Study of Performance. *Applied Sciences*, v. 10, n. 17, art. 5797, 2020. DOI: [10.3390/app10175797](https://doi.org/10.3390/app10175797)

Publicações fortemente correlatas em **periódicos irmãos da mesma editora**, indicativas de que o ecossistema MDPI é receptivo a este tipo de estudo:

- *Symmetry*, v. 14, n. 9, art. 1824, 2022 — "Development of a Quality-Based Model for Software Architecture Optimization: A Case Study of Monolith and Microservice Architectures". https://www.mdpi.com/2073-8994/14/9/1824
- *Electronics*, v. 15, n. 1, art. 221 — "Evaluating Middleware Performance in the Transition from Monolithic to Microservices Architecture for Banking Applications". https://www.mdpi.com/2079-9292/15/1/221

**Por que interessa a esta IC.** Publicou Tapia *et al.* (2020), cuja metodologia de *benchmark* — mesma funcionalidade implementada em arquiteturas diferentes, com medição de CPU, memória e latência — é a que esta pesquisa replica. Sendo de acesso aberto, tem barreira de leitura zero, o que facilita tanto a consulta quanto a futura citação do trabalho.

---

## PARTE 3 — Congressos, Simpósios e Eventos Científicos

### Evento 1 — SBCARS: Simpósio Brasileiro de Componentes, Arquiteturas e Reutilização de Software

| Campo | Informação |
|---|---|
| **Nome** | SBCARS — Simpósio Brasileiro de Componentes, Arquiteturas e Reutilização de Software (**XX edição em 2026**) |
| **Instituição responsável** | Sociedade Brasileira de Computação (SBC), realizado dentro do **CBSoft — Congresso Brasileiro de Software: Teoria e Prática** (XVII edição) |
| **Área temática** | Engenharia de Software, com foco em linhas de produto de software, desenvolvimento baseado em componentes, **arquitetura de software** e reutilização |
| **Periodicidade** | Anual, desde 2007 — sucessor da série de seis *Workshops de Desenvolvimento Baseado em Componentes* (WDBC), iniciada em 2001 |
| **Local / modalidade** | Presencial, no Instituto de Matemática, Estatística e Ciência da Computação da USP (**IME-USP**), São Paulo, de **8 a 11 de setembro de 2026** |
| **Link oficial** | http://cbsoft.sbc.org.br/2026/en/symposiums/sbcars/call/ — CBSoft 2026: https://cbsoft.sbc.org.br/2026/pt/cbsoft/ — datas: https://cbsoft.sbc.org.br/2026/pt/dates/ |
| **Anais** | SOL — Biblioteca Digital da SBC: https://sol.sbc.org.br/index.php/sbcars |

**Principais assuntos abordados.** Arquitetura de software, padrões de projeto, qualidade e dívida técnica arquitetural, componentes reutilizáveis, linhas de produto, microsserviços.

**Formatos de trabalho aceitos.** Artigos técnicos de pesquisa e **artigos de dados** (*data papers*) centrados em *datasets*, *benchmarks* e repositórios curados — até 4 páginas mais 2 de referências, descrevendo contexto, processo de criação, estrutura, limitações e potencial de reutilização dos dados. Submissões em **PDF, em português ou inglês**, seguindo estritamente o *template* da conferência. Cada artigo é avaliado por no mínimo três membros do Comitê de Programa, em processo duplo-cego, com critérios de originalidade, novidade e inovação em relação ao estado da arte.

**Exemplos de trabalhos apresentados (edições recentes).** "Agile Software Architecture: Perceptions on Quality and Architectural Technical Debt Management"; detecção de *code smells* com aprendizado de máquina; arquiteturas de referência para gêmeos digitais; geração de arquiteturas de microsserviços a partir de requisitos textuais usando modelos de linguagem de grande escala. A edição de 2025 (19ª, realizada em Recife de 22 a 26 de setembro) aceitou 11 dos 39 artigos submetidos — taxa de aceitação de 28,2%.

**Por que interessa a esta IC.** É o evento cuja ementa coincide de forma mais direta com o objeto da pesquisa. A aceitação de submissões em português e a existência de uma categoria de *data paper* o tornam duplamente viável: as métricas coletadas nas três versões do protótipo constituem, por si, um conjunto de dados publicável.

> #### Oportunidade imediata — Concurso de Trabalhos de Iniciação Científica (CTIC/CBSoft)
>
> O CBSoft 2026 mantém, junto ao SBES, um **Concurso de Trabalhos de Iniciação Científica** voltado especificamente a estudantes de graduação, ensino médio e técnico matriculados em 2025 ou 2026 em instituições brasileiras — exatamente o perfil desta pesquisa.
>
> - **Formato:** Mostra de Trabalhos em **sessão de pôsteres** durante o evento; a participação na Mostra é pré-requisito para a apresentação oral e, por consequência, para concorrer à premiação.
> - **Comprovação exigida:** comprovante de matrícula ou histórico escolar, enviado pela plataforma de submissão. Submissões sujeitas ao Código de Conduta para Autores em Publicações da SBC.
> - **Link:** https://cbsoft.sbc.org.br/2026/pt/symposiums/sbes/ctic/call/
> - **A confirmar na página oficial:** limite de páginas do texto submetido e prazo de submissão da edição 2026.
>
> Este é o veículo de menor barreira de entrada e maior aderência ao estágio atual da IC.

---

### Evento 2 — ICSA: IEEE International Conference on Software Architecture

| Campo | Informação |
|---|---|
| **Nome** | ICSA 2026 — 23rd IEEE International Conference on Software Architecture |
| **Instituição responsável** | IEEE; edição de 2026 sediada pela Vrije Universiteit Amsterdam |
| **Área temática** | Arquitetura de software — é a conferência internacional de referência da subárea |
| **Tema da edição 2026** | *Architecting in Continuous Software Engineering: Evolving Roles, Enduring Principles* |
| **Periodicidade** | Anual |
| **Local / modalidade** | Presencial, Amsterdam, Países Baixos, de **22 a 26 de junho de 2026** |
| **Link oficial** | https://conf.researchr.org/home/icsa-2026 — trilha de pesquisa: https://conf.researchr.org/track/icsa-2026/icsa-2026-papers — série histórica: https://icsa-conferences.org/series/ |
| **Anais** | IEEE Xplore Digital Library |

**Principais assuntos abordados.** Atributos de qualidade novos e emergentes, táticas para atendê-los e métodos para analisá-los — incluindo consumo de energia e medição de impacto ambiental; arquitetura em engenharia de software contínua; evolução arquitetural; decisões de projeto.

**Formatos de trabalho aceitos.**

| Trilha | Extensão | Perfil |
|---|---|---|
| *Research Papers* | Artigo completo | Pesquisa original com avaliação consistente |
| *Software Architecture in Practice* | 4 a 8 páginas (artigos regulares) ou até 2 páginas (propostas de palestra técnica) | Experiência industrial e prática arquitetural |
| *New and Emerging Ideas* (NEMI) | Até 5 páginas, incluindo texto, referências, apêndices e figuras | Ideias em amadurecimento, resultados preliminares |
| *Journal First* | — | Artigo já aceito em periódico, apresentado na conferência |
| *Tutorials / Tech Briefings* | Até 2 páginas, formato IEEE CS | Propostas de tutorial |

**Datas da edição 2026.** Resumos da trilha de pesquisa em 28 de novembro de 2025; artigos completos em 5 de dezembro de 2025; demais trilhas em 13 de fevereiro de 2026.

**Por que interessa a esta IC.** É onde a comunidade internacional de arquitetura de software discute exatamente o tipo de questão desta pesquisa: como decisões estruturais afetam atributos de qualidade mensuráveis. A trilha NEMI, com limite de 5 páginas, é o ponto de entrada compatível com resultados preliminares.

---

### Evento 3 — ICPE: ACM/SPEC International Conference on Performance Engineering

| Campo | Informação |
|---|---|
| **Nome** | ICPE 2026 — 17th ACM/SPEC International Conference on Performance Engineering |
| **Instituição responsável** | ACM (*Association for Computing Machinery*) e SPEC (*Standard Performance Evaluation Corporation*) |
| **Área temática** | Engenharia de desempenho: modelagem, predição, medição e avaliação de desempenho baseada em *benchmarks* |
| **Origem** | Nasceu da fusão de um *workshop* da ACM sobre software e predição de desempenho com um *workshop* da SPEC sobre *benchmarking* e avaliação de desempenho |
| **Periodicidade** | Anual |
| **Local / modalidade** | Presencial, Florença, Itália, de **4 a 8 de maio de 2026** |
| **Link oficial** | https://icpe2026.spec.org/ — trilha de pesquisa: https://icpe2026.spec.org/tracks-and-submissions/research-paper-track/ — datas: https://icpe2026.spec.org/important-dates/ |
| **Anais** | ACM Digital Library — https://dl.acm.org/conference/icpe (anais da 17ª edição: https://dl.acm.org/doi/proceedings/10.1145/3777884) |

**Principais assuntos abordados.** Medição de desempenho e avaliação empírica; modelagem de desempenho de software e sistemas; processos de projeto e desenvolvimento; gerenciamento e adaptação de desempenho em tempo de execução; otimizações relacionadas à plataforma; *benchmarking* de desempenho.

**Formatos de trabalho aceitos.** A trilha de pesquisa distingue dois tipos: **artigos regulares**, com conteúdo de pesquisa original e avaliação consistente, e artigos **EERCS** (*Empirical / Experience / Reproduction / Case Study*), voltados a avaliação empírica, experiências reais, reproduções e estudos de caso. Limite de **10 páginas**, incluindo todas as figuras, em formato ACM de duas colunas. Revisão **duplo-anônima**. Há também trilha industrial, *journal first*, *workshops* e tutoriais. Submissão via HotCRP (https://icpe2026.hotcrp.com/).

**Datas da edição 2026.** Submissão da trilha de pesquisa em 10 de novembro de 2025 (AoE); notificação aos autores em 19 de janeiro de 2026 (AoE).

***Workshops* da edição 2026** — vários diretamente pertinentes: **LTB** (*Load Testing and Benchmarking of Software Systems*), **HotCloudPerf** (tópicos emergentes em desempenho de nuvem), **AIPerfLLM**, **WEPPE** (engenharia de desempenho em contextos educacionais e práticos) e **QualITA** (qualidade de sistemas e serviços).

**Por que interessa a esta IC.** É o evento cuja **metodologia** coincide com a desta pesquisa. Enquanto SBCARS e ICSA discutem o *objeto* (arquitetura), o ICPE discute o *método* (como medir desempenho de forma válida, reprodutível e comparável). A existência da categoria EERCS — explicitamente voltada a estudos de caso e avaliação empírica — e do *workshop* LTB, dedicado a testes de carga e *benchmarking*, torna o evento uma referência obrigatória para o desenho do experimento do protótipo tripartido, independentemente de haver submissão.

---

## PARTE 4 — Organização da Pesquisa

### 4.1 Periódicos

| Periódico | Área | Temas relacionados à minha IC | Exemplos de artigos | Link |
|---|---|---|---|---|
| **IEEE Access** (ISSN 2169-3536) | Multidisciplinar IEEE, com forte concentração em Ciência da Computação | Comparação empírica de padrões arquiteturais; desempenho e escalabilidade; computação em nuvem | Blinowski *et al.* (2022), *Monolithic vs. Microservice Architecture*; Velepucha & Flores (2023), *A Survey on Microservices Architecture* | [ieeeaccess.ieee.org](https://ieeeaccess.ieee.org/) |
| **Journal of Systems and Software** (ISSN 0164-1212) | Engenharia de Software | Métricas de software; questões de desempenho; arquitetura; manutenibilidade e evolução — com exigência de validação empírica | Di Francesco, Lago & Malavolta (2019), *Architecting with Microservices*; Assunção *et al.* (2023), *How do Microservices Evolve?* | [sciencedirect.com/journal/journal-of-systems-and-software](https://www.sciencedirect.com/journal/journal-of-systems-and-software) |
| **Applied Sciences** (ISSN 2076-3417) | Ciências aplicadas; seção *Computing and Artificial Intelligence* | *Benchmark* de arquiteturas com medição de CPU, memória e latência; arquiteturas em nuvem | Tapia *et al.* (2020), *From Monolithic Systems to Microservices* | [mdpi.com/journal/applsci](https://www.mdpi.com/journal/applsci) |

### 4.2 Eventos Científicos

| Evento | Área | Temas relacionados à minha IC | Tipo de evento | Link |
|---|---|---|---|---|
| **SBCARS 2026** (XX edição) | Engenharia de Software — componentes, arquiteturas e reutilização | Arquitetura de software; padrões de projeto; dívida técnica arquitetural; qualidade estrutural | Simpósio nacional, dentro do congresso CBSoft (SBC); presencial, IME-USP, 8–11/09/2026; aceita PT ou EN | [cbsoft.sbc.org.br/2026 — SBCARS](http://cbsoft.sbc.org.br/2026/en/symposiums/sbcars/call/) |
| **ICSA 2026** (23ª edição) | Arquitetura de software | Atributos de qualidade e táticas arquiteturais; métodos de análise; evolução arquitetural | Conferência internacional IEEE; presencial, Amsterdam, 22–26/06/2026; anais no IEEE Xplore | [conf.researchr.org/home/icsa-2026](https://conf.researchr.org/home/icsa-2026) |
| **ICPE 2026** (17ª edição) | Engenharia de desempenho | Medição de desempenho e avaliação empírica; *benchmarking*; modelagem de desempenho de software | Conferência internacional ACM/SPEC; presencial, Florença, 4–8/05/2026; anais na ACM DL | [icpe2026.spec.org](https://icpe2026.spec.org/) |
| *(Complementar)* **CTIC/CBSoft 2026** | Iniciação Científica em Engenharia de Software | Trabalhos de IC em qualquer tema de Engenharia de Software | Concurso com Mostra em sessão de **pôsteres**, dentro do CBSoft; exclusivo para estudantes de graduação/médio/técnico | [CTIC — CBSoft 2026](https://cbsoft.sbc.org.br/2026/pt/symposiums/sbes/ctic/call/) |

---

## PARTE 5 — Análise

### 1. Qual periódico encontrado possui maior relação com o meu tema?

O **Journal of Systems and Software**, por dois motivos que se reforçam.

O primeiro é de escopo: o JSS é dedicado exclusivamente à Engenharia de Software e lista, entre seus temas de interesse, precisamente a combinação que esta IC investiga — métricas de software, questões de desempenho e arquitetura de sistemas. O IEEE Access, embora tenha publicado o trabalho relacionado mais próximo, é um periódico multidisciplinar que abrange todos os campos do IEEE; a Applied Sciences é ainda mais ampla, cobrindo ciências aplicadas em geral. Em ambos, a pesquisa em arquitetura de software é uma fração do conteúdo; no JSS, é o centro.

O segundo motivo é metodológico e mais decisivo: o JSS exige que todo artigo apresente evidência que sustente suas afirmações — por estudo empírico, simulação ou prova formal. Essa exigência editorial é exatamente o desenho desta pesquisa. O protótipo tripartido existe para produzir evidência quantitativa em condições controladas, em vez de argumentar por autoridade ou preferência. Um periódico que impõe essa exigência a todos os seus autores é o que melhor reconhece o valor da contribuição pretendida.

A ressalva honesta é que o JSS é também o mais exigente dos três. Como caminho realista, o IEEE Access é o veículo mais acessível para uma primeira submissão de periódico, e a Applied Sciences oferece a vantagem do acesso aberto integral.

### 2. Qual evento científico possui maior relação com o meu tema?

O **SBCARS**, cuja própria denominação nomeia o objeto desta pesquisa — arquiteturas de software. Nenhum outro evento identificado tem sobreposição temática tão literal.

Além da aderência de tema, três características o tornam o evento de maior utilidade prática neste momento. Aceita submissões em **português**, o que remove a barreira de redação em língua estrangeira para uma primeira publicação. Mantém uma categoria de ***data paper*** — até 4 páginas mais 2 de referências — que reconhece como contribuição publicável o próprio conjunto de dados: as métricas de desempenho e qualidade coletadas nas três versões do protótipo, com a descrição de seu contexto, processo de criação, estrutura, limitações e potencial de reutilização. E ocorre dentro do CBSoft, que hospeda o **Concurso de Trabalhos de Iniciação Científica**, com Mostra em sessão de pôsteres destinada especificamente a estudantes de graduação.

O ICSA tem prestígio internacional superior e o ICPE domina a metodologia de medição, mas ambos exigem redação em inglês, submissão com meses de antecedência e resultados mais maduros. O SBCARS, e antes dele o CTIC, formam a sequência de entrada mais viável.

### 3. Que tipos de pesquisas encontrei nesses periódicos e eventos?

Cinco tipos recorrentes, e a distinção entre eles é relevante para posicionar esta IC:

**Estudos empíricos comparativos.** Implementam a mesma funcionalidade sob arquiteturas diferentes e medem indicadores objetivos. Blinowski *et al.* (2022) e Tapia *et al.* (2020) são exatamente isso. É a categoria desta pesquisa.

**Revisões sistemáticas e estudos de mapeamento.** Sintetizam o estado da arte a partir de um protocolo explícito de seleção. Di Francesco, Lago e Malavolta (2019) cobriram 103 trabalhos primários; Abgaz *et al.* (2023) examinaram 35 artigos sob protocolo de *systematic literature review* com *snowballing*.

***Surveys* e artigos de taxonomia.** Organizam princípios, padrões e desafios de uma subárea sem coletar dados primários — o caso de Velepucha e Flores (2023).

**Estudos de mineração de repositórios.** Extraem evidência de projetos reais de código aberto, como Assunção *et al.* (2023), que analisaram mudanças em repositórios de microsserviços para caracterizar como esses sistemas evoluem.

**Relatos de experiência e artigos de dados.** Descrevem a aplicação de uma abordagem em contexto industrial real, ou publicam *datasets* e *benchmarks* como contribuição em si — categorias formalmente previstas na trilha *Software Architecture in Practice* do ICSA, na categoria EERCS do ICPE e nos *data papers* do SBCARS.

### 4. O que percebi sobre as pesquisas que estão sendo desenvolvidas na minha área?

**O eixo dominante é monólito × microsserviços, e há uma lacuna clara nesse padrão.** Praticamente toda a produção localizada opõe esses dois extremos. A Clean Architecture e a Arquitetura em Camadas aparecem quase sempre como boas práticas internas de um monólito — como forma de mantê-lo organizado e preparado para evolução futura — e não como objetos de comparação empírica em pé de igualdade. Isso confirma a lacuna que motiva esta IC e, ao mesmo tempo, indica que a contribuição precisa ser formulada em diálogo com essa literatura, não à margem dela.

**Resultados contraintuitivos são comuns, o que valoriza a medição.** Blinowski *et al.* (2022) mostraram que, em máquina única, o monólito supera os microsserviços em latência — e a comunicação em processo é a explicação recorrente para monólitos apresentarem menor latência, enquanto microsserviços vencem em escalonamento granular sob carga variável. A conclusão prática é que não existe padrão superior em abstrato: o resultado depende de contexto, carga e infraestrutura. Isso é uma advertência metodológica direta para esta pesquisa — as conclusões precisarão ser condicionadas ao cenário medido, não generalizadas.

**A área é autocrítica quanto à própria maturidade.** Abgaz *et al.* (2023) concluem que a decomposição de monólitos em microsserviços permanece em estágio inicial e que faltam métodos que combinem dados estáticos, dinâmicos e evolutivos. Esse tipo de avaliação, publicada em um periódico de primeira linha, mostra que a área ainda tem problemas abertos — não é um campo esgotado.

**Métricas e vocabulário estão consolidados.** Repetem-se, com pouca variação, tempo de resposta, *throughput*, uso de CPU e memória, tempo de recuperação, acoplamento, testabilidade e dívida técnica. Adotar esse mesmo vocabulário no protótipo é o que permite comparar os resultados com a literatura, e é o que já está previsto no Dashboard Administrativo do projeto.

**A pauta se amplia para atributos novos.** O ICSA 2026 destaca atributos de qualidade emergentes, incluindo **consumo de energia e impacto ambiental**, e o ICPE 2026 abriu *workshop* sobre desempenho no contexto de modelos de linguagem de grande escala. São direções de expansão futura para esta pesquisa.

**Método é objeto de escrutínio explícito.** Revisão duplo-cega no SBCARS, duplo-anônima no ICPE, e exigência editorial de evidência no JSS. Em todos os veículos, *como* se mediu pesa tanto quanto *o que* se mediu.

### 5. Como essa pesquisa pode ajudar no desenvolvimento da minha IC?

**Definiu um alvo concreto e datado.** Antes desta atividade, "publicar a IC" era uma intenção abstrata. Agora existe uma sequência: CTIC/CBSoft em setembro de 2026 como primeira exposição em formato de pôster; SBCARS como submissão de artigo, possivelmente como *data paper*; e periódico como destino final do estudo completo. Cada etapa tem um prazo e um formato conhecidos, e os prazos são anteriores ao evento em vários meses — o que significa que a coleta de métricas precisa ser planejada de trás para frente a partir deles.

**Deu limites de extensão para calibrar a escrita.** Até 5 páginas na trilha NEMI do ICSA; 10 páginas na trilha de pesquisa do ICPE; até 4 mais 2 no *data paper* do SBCARS. Saber disso desde já muda como o texto vai ser produzido: o material atual, escrito sem restrição de tamanho, terá de ser condensado a um recorte específico, e é mais eficiente escrever já dentro do limite do que cortar depois.

**Forneceu padrões metodológicos a seguir.** Os tópicos da trilha de pesquisa do ICPE — medição de desempenho, avaliação empírica, *benchmarking* — funcionam como uma lista de verificação para o desenho do experimento do protótipo. O *workshop* LTB, dedicado a testes de carga e *benchmarking* de sistemas de software, é fonte direta de referência sobre como estruturar a coleta de forma que os números resultantes sejam defensáveis. Ler o que esses veículos publicam sobre método reduz o risco de coletar dados que depois se revelem inválidos por falha de desenho.

**Revelou como formular a contribuição.** Constatar que a literatura opõe quase exclusivamente monólito e microsserviços mostra que o argumento da IC não deve ser "comparo três padrões" — e sim "a literatura comparou os extremos e ignorou os padrões intermediários de organização interna, que são justamente os que a maioria das equipes de fato usa". Essa é a formulação que dialoga com o estado da arte.

**Expandiu a base bibliográfica.** Três referências relevantes foram localizadas por meio desta atividade e não constavam no levantamento anterior: Velepucha e Flores (2023), Assunção *et al.* (2023) e Abgaz *et al.* (2023).

**Obrigou a auditar as referências existentes.** Exigir nome de periódico, ISSN e Qualis de cada fonte expôs erros de metadados nas referências já reunidas — dois deles descritos na Nota 2 deste documento. Referências com metadados incorretos são um problema real em submissão: comprometem a credibilidade do trabalho e podem impedir a verificação pelos revisores.

---

## PARTE 6 — Trabalhos Semelhantes

**Veículo escolhido:** **IEEE Access** (ISSN 2169-3536) — periódico que já publicou o trabalho relacionado mais direto desta pesquisa. Os dois trabalhos abaixo foram publicados nesse mesmo periódico.

### Trabalho 1

| Campo | Informação |
|---|---|
| **Título** | Monolithic vs. Microservice Architecture: A Performance and Scalability Evaluation |
| **Autores** | Grzegorz J. Blinowski; Anna Ojdowska; Adam Przybyłek |
| **Ano** | 2022 |
| **Onde foi publicado** | *IEEE Access*, v. 10, p. 20357–20374 |
| **DOI / Link** | [10.1109/ACCESS.2022.3152803](https://doi.org/10.1109/ACCESS.2022.3152803) — https://ieeexplore.ieee.org/document/9717259 |

**Relação com o tema desta IC.** É o trabalho de maior proximidade metodológica com esta pesquisa. Realiza uma comparação empírica controlada entre padrões arquiteturais, medindo desempenho e escalabilidade — o mesmo procedimento que o protótipo tripartido executa, alterando apenas os padrões comparados. Duas contribuições são apropriadas diretamente: (i) o conjunto de métricas coletadas, que orienta os indicadores do Dashboard Administrativo do protótipo; e (ii) o resultado contraintuitivo de que, em máquina única, o monólito supera os microsserviços em latência. Esse achado gerou a hipótese, a ser verificada nesta pesquisa, de que o monólito também apresentará menor latência em cenários de baixa carga quando comparado às versões em Camadas e Clean Architecture. Funciona igualmente como referência de estrutura de texto: mostra como um estudo comparativo de arquiteturas é organizado e argumentado em um periódico indexado. O PDF já integra o acervo do projeto, em [docs/artigos/TrabalhosRelacionados/](../docs/artigos/TrabalhosRelacionados/).

### Trabalho 2

| Campo | Informação |
|---|---|
| **Título** | A Survey on Microservices Architecture: Principles, Patterns and Migration Challenges |
| **Autores** | Victor Velepucha; Pamela Flores |
| **Ano** | 2023 |
| **Onde foi publicado** | *IEEE Access*, v. 11, p. 88339–88358 |
| **DOI / Link** | [10.1109/ACCESS.2023.3305687](https://doi.org/10.1109/ACCESS.2023.3305687) |

**Relação com o tema desta IC.** Trata-se de um *survey* que sistematiza princípios, padrões e desafios de migração em arquitetura de microsserviços. A relação com esta pesquisa é de **posicionamento conceitual**, não de método: enquanto o Trabalho 1 fornece o modelo de experimento, este fornece o mapa da subárea. Três usos são imediatos. Primeiro, ajuda a situar Monólito, Camadas e Clean Architecture no espectro evolutivo dos padrões arquiteturais — papel que, na fundamentação atual do projeto, é cumprido por Fowler e Lewis (2014), um artigo de 2014 que este *survey* de 2023 atualiza. Segundo, o inventário de desafios de migração embasa a hipótese de que a Clean Architecture favorece a evolução futura para microsserviços, por isolar as regras de negócio e facilitar a extração de módulos. Terceiro, sendo publicado no mesmo periódico e sendo recente, serve de referência do padrão de redação e profundidade que o IEEE Access espera em artigos de arquitetura de software.

---

## Notas Metodológicas

### Nota 1 — Sobre a classificação Qualis

A atividade solicita o estrato Qualis "se disponível". Durante esta pesquisa, **não foi possível obter valores confiáveis em fontes secundárias**: listas publicadas por diferentes programas de pós-graduação atribuíram estratos divergentes ao mesmo periódico. Para o IEEE Access (ISSN 2169-3536), foram encontradas atribuições de **A1**, **A3** e **B3** em fontes distintas; para a Applied Sciences (ISSN 2076-3417), **A3** e **A4**; para o Journal of Systems and Software (ISSN 0164-1212), **A2** em uma lista de 2016, portanto anterior à metodologia vigente.

A divergência tem explicação: a metodologia do **Qualis Referência do quadriênio 2017–2020** alterou a forma de classificação em relação aos ciclos anteriores, passando a usar os estratos A1, A2, A3, A4, B1, B2, B3, B4 e C, e listas de terceiros frequentemente misturam ciclos de avaliação diferentes. Registrar aqui um estrato copiado de fonte secundária seria transmitir informação possivelmente incorreta.

**Encaminhamento:** a consulta deve ser feita diretamente na Plataforma Sucupira, fonte oficial, por ISSN:
- Consulta Qualis/CAPES: https://sucupira.capes.gov.br/sucupira/public/consultas/coleta/veiculoPublicacaoQualis/listaConsultaGeralPeriodicos.jsf
- Metodologia do Qualis Referência 2017–2020: https://www.gov.br/capes/pt-br/acesso-a-informacao/acoes-e-programas/avaliacao/avaliacao-quadrienal/avaliacao-quadrienal-2017-2020/metodologia-do-qualis-referencia-quadrienio-2017-2020

Ao consultar, é necessário selecionar a área de avaliação **Ciência da Computação** — o mesmo periódico recebe estratos diferentes em áreas diferentes.

### Nota 2 — Correções de metadados identificadas nas referências do projeto

A exigência de identificar periódico, volume e ISSN de cada fonte expôs dois erros de metadados no documento técnico-científico da Atividade 05. Ambos foram verificados nas fontes primárias:

**(a) Tapia *et al.* (2020).** O título e a inicial do primeiro autor estão incorretos no documento. A referência verificada é:

> TAPIA, F.; MORA, M. Á.; FUERTES, W.; AULES, H.; FLORES, E.; TOULKERIDIS, T. From Monolithic Systems to Microservices: A Comparative Study of Performance. **Applied Sciences**, v. 10, n. 17, art. 5797, 2020. DOI: 10.3390/app10175797.

Verificado em: https://www.mdpi.com/2076-3417/10/17/5797 e https://doi.org/10.3390/app10175797

**(b) Tu (2023).** O documento atribui a referência a periódico, título, volume e páginas incorretos. A referência verificada é:

> TU, Z. Research on the Application of Layered Architecture in Computer Software Development. **Journal of Computing and Electronic Information Management**, v. 11, n. 3, p. 34–38, 2023. DOI: 10.54097/jceim.v11i3.08.

Verificado em: https://drpress.org/ojs/index.php/jceim/article/view/14398 e https://doi.org/10.54097/jceim.v11i3.08

O arquivo [referencias/tarefa04-referencias.md](../referencias/tarefa04-referencias.md) já registra as duas referências de forma correta — a divergência está apenas no documento técnico-científico.

---

## Referências Encontradas Nesta Atividade

Trabalhos localizados durante esta pesquisa que ainda não constavam no levantamento bibliográfico do projeto e são candidatos a incorporação:

1. VELEPUCHA, V.; FLORES, P. A Survey on Microservices Architecture: Principles, Patterns and Migration Challenges. **IEEE Access**, v. 11, p. 88339–88358, 2023. DOI: [10.1109/ACCESS.2023.3305687](https://doi.org/10.1109/ACCESS.2023.3305687).
2. ASSUNÇÃO, W. K. G.; KRÜGER, J.; MOSSER, S.; SELAOUI, S. How do Microservices Evolve? An Empirical Analysis of Changes in Open-Source Microservice Repositories. **Journal of Systems and Software**, v. 204, art. 111788, 2023. DOI: [10.1016/j.jss.2023.111788](https://doi.org/10.1016/j.jss.2023.111788).
3. ABGAZ, Y.; MCCARREN, A.; ELGER, P.; SOLAN, D.; LAPUZ, N.; BIVOL, M. *et al.* Decomposition of Monolith Applications Into Microservices Architectures: A Systematic Review. **IEEE Transactions on Software Engineering**, v. 49, n. 8, p. 4213–4242, 2023. DOI: [10.1109/TSE.2023.3287297](https://doi.org/10.1109/TSE.2023.3287297).

---

## Fontes Consultadas

**Periódicos**
- IEEE Access — página oficial: https://ieeeaccess.ieee.org/
- IEEE Access — registro ISSN: https://portal.issn.org/resource/ISSN/2169-3536
- IEEE Access — indexação DOAJ: https://doaj.org/toc/2169-3536
- Journal of Systems and Software — ScienceDirect: https://www.sciencedirect.com/journal/journal-of-systems-and-software
- Journal of Systems and Software — guia para autores: https://www.sciencedirect.com/journal/journal-of-systems-and-software/publish/guide-for-authors
- Applied Sciences — MDPI: https://www.mdpi.com/journal/applsci

**Eventos**
- CBSoft 2026 — página institucional: https://cbsoft.sbc.org.br/2026/pt/cbsoft/
- SBCARS 2026 — chamada de trabalhos: http://cbsoft.sbc.org.br/2026/en/symposiums/sbcars/call/
- CBSoft 2026 — datas importantes: https://cbsoft.sbc.org.br/2026/pt/dates/
- CTIC/CBSoft 2026 — Concurso de Trabalhos de Iniciação Científica: https://cbsoft.sbc.org.br/2026/pt/symposiums/sbes/ctic/call/
- SBCARS — anais na SOL/SBC: https://sol.sbc.org.br/index.php/sbcars
- IME-USP — anúncio da sede do CBSoft 2026: https://www.ime.usp.br/ime-usp-sedia-congressso-brasileiro-de-software-2026/
- ICSA 2026 — página principal: https://conf.researchr.org/home/icsa-2026
- ICSA 2026 — trilha de pesquisa: https://conf.researchr.org/track/icsa-2026/icsa-2026-papers
- ICSA 2026 — trilha *New and Emerging Ideas*: https://conf.researchr.org/track/icsa-2026/icsa-2026-new-and-emerging-ideas
- ICSA 2026 — trilha *Software Architecture in Practice*: https://conf.researchr.org/track/icsa-2026/icsa-2026-software-architecture-in-practice-track
- ICSA — série histórica: https://icsa-conferences.org/series/
- ICPE 2026 — página principal: https://icpe2026.spec.org/
- ICPE 2026 — trilha de pesquisa: https://icpe2026.spec.org/tracks-and-submissions/research-paper-track/
- ICPE 2026 — datas importantes: https://icpe2026.spec.org/important-dates/
- ICPE — anais na ACM Digital Library: https://dl.acm.org/conference/icpe
- ICPE 2026 — anais da 17ª edição: https://dl.acm.org/doi/proceedings/10.1145/3777884

**Classificação e indexação**
- Plataforma Sucupira — consulta Qualis: https://sucupira.capes.gov.br/sucupira/public/consultas/coleta/veiculoPublicacaoQualis/listaConsultaGeralPeriodicos.jsf
- CAPES — metodologia do Qualis Referência 2017–2020: https://www.gov.br/capes/pt-br/acesso-a-informacao/acoes-e-programas/avaliacao/avaliacao-quadrienal/avaliacao-quadrienal-2017-2020/metodologia-do-qualis-referencia-quadrienio-2017-2020

**Artigos citados**
- Blinowski *et al.* (2022): https://doi.org/10.1109/ACCESS.2022.3152803 — https://ieeexplore.ieee.org/document/9717259
- Velepucha & Flores (2023): https://doi.org/10.1109/ACCESS.2023.3305687
- Di Francesco, Lago & Malavolta (2019): https://doi.org/10.1016/j.jss.2019.01.001
- Assunção *et al.* (2023): https://doi.org/10.1016/j.jss.2023.111788
- Tapia *et al.* (2020): https://doi.org/10.3390/app10175797 — https://www.mdpi.com/2076-3417/10/17/5797
- Abgaz *et al.* (2023): https://doi.org/10.1109/TSE.2023.3287297
- Tu (2023): https://doi.org/10.54097/jceim.v11i3.08 — https://drpress.org/ojs/index.php/jceim/article/view/14398

---

## Verificação dos Requisitos Mínimos

| Requisito | Situação | Onde |
|---|---|---|
| 4 formas de publicação científica | Atendido — Artigo científico, Artigo completo em congresso, Pôster científico, Simpósio | Parte 1 |
| 3 periódicos relacionados ao tema | Atendido — IEEE Access, Journal of Systems and Software, Applied Sciences | Parte 2 |
| 3 congressos/eventos relacionados à área | Atendido — SBCARS, ICSA, ICPE (mais CTIC/CBSoft como complementar) | Parte 3 |
| 2 trabalhos científicos relacionados ao tema | Atendido — Blinowski *et al.* (2022) e Velepucha & Flores (2023), ambos no IEEE Access | Parte 6 |
| Tabela comparativa dos periódicos | Atendido | Parte 4.1 |
| Tabela comparativa dos eventos | Atendido | Parte 4.2 |
| Análise das descobertas | Atendido — cinco perguntas respondidas | Parte 5 |
| Links das fontes pesquisadas | Atendido | Fontes Consultadas |
| Organização no GitHub | Atendido — `/publicacao/tarefa06-publicacao.md` | Este arquivo |
