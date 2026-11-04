# Fontes e trabalhos relacionados — Atividade 09

Fontes citadas no manuscrito [`resumo-expandido.docx`](../manuscrito/resumo-expandido.docx), exibidas no padrão ABNT (NBR 6023) do template adotado, mais as fontes de regras e exemplos consultados.

**Conferência citação ↔ referência:** 14 obras citadas no texto, 14 na lista, todas em correspondência.

---

## Trabalhos relacionados (base empírica e lacuna)

| Obra | Papel no manuscrito | PDF no repositório |
|---|---|---|
| Blinowski, Ojdowska e Przybyłek (2022), *IEEE Access* | Trabalho mais próximo metodologicamente; base das métricas e da hipótese de latência do monólito | [docs/artigos/TrabalhosRelacionados](../../../docs/artigos/TrabalhosRelacionados/) |
| Tapia *et al.* (2020), *Applied Sciences* | Mesmo desenho experimental (mesma funcionalidade, arquiteturas distintas, medição equivalente) | [docs/artigos/ReferênciasCientíficasProtótipo](../../../docs/artigos/) |
| Di Francesco, Lago e Malavolta (2019), *JSS* | Mapeamento sistemático (103 estudos); predominância do eixo monólito–microsserviços | [docs/artigos/TrabalhosRelacionados](../../../docs/artigos/TrabalhosRelacionados/) |
| Abgaz *et al.* (2023), *IEEE TSE* | Revisão sistemática (35 estudos); decomposição de monólitos em estágio inicial | [docs/artigos/TrabalhosRelacionados](../../../docs/artigos/TrabalhosRelacionados/) |
| Velepucha e Flores (2023), *IEEE Access* | Princípios, padrões e desafios de migração | [docs/artigos/TrabalhosRelacionados](../../../docs/artigos/TrabalhosRelacionados/) |

**Lacuna delimitada:** nenhum dos estudos identificados avalia empiricamente a Clean Architecture em comparação controlada com o monólito e com a Arquitetura em Camadas, sob identidade funcional, de linguagem e de infraestrutura.

## Referências do manuscrito (ABNT)

- ABGAZ, Y. *et al.* Decomposition of monolith applications into microservices architectures: a systematic review. **IEEE Transactions on Software Engineering**, v. 49, n. 8, p. 4213-4242, 2023. DOI: 10.1109/TSE.2023.3287297.
- AMAZON WEB SERVICES. **AWS Well-Architected Framework**. [S. l.]: AWS, 2023. Disponível em: https://aws.amazon.com/architecture/well-architected/. Acesso em: 20 maio 2026.
- BASS, L.; CLEMENTS, P.; KAZMAN, R. **Software architecture in practice**. 3. ed. Boston: Addison-Wesley, 2012.
- BLINOWSKI, G.; OJDOWSKA, A.; PRZYBYŁEK, A. Monolithic vs. microservice architecture: a performance and scalability evaluation. **IEEE Access**, v. 10, p. 20357-20374, 2022. DOI: 10.1109/ACCESS.2022.3152803.
- DI FRANCESCO, P.; LAGO, P.; MALAVOLTA, I. Architecting with microservices: a systematic mapping study. **Journal of Systems and Software**, v. 150, p. 77-97, 2019. DOI: 10.1016/j.jss.2019.01.001.
- DRAGONI, N. *et al.* Microservices: yesterday, today, and tomorrow. *In*: MAZZARA, M.; MEYER, B. (ed.). **Present and ulterior software engineering**. Cham: Springer, 2017. p. 195-216.
- FOWLER, M. **Patterns of enterprise application architecture**. Boston: Addison-Wesley, 2002.
- GARLAN, D.; SHAW, M. An introduction to software architecture. *In*: AMBRIOLA, V.; TORTORA, G. (ed.). **Advances in software engineering and knowledge engineering**. Singapore: World Scientific Publishing, 1993. p. 1-39.
- MARTIN, R. C. **Clean architecture**: a craftsman's guide to software structure and design. Upper Saddle River: Prentice Hall, 2017.
- NEWMAN, S. **Building microservices**: designing fine-grained systems. Sebastopol: O'Reilly Media, 2015.
- RICHARDS, M. **Software architecture patterns**. Sebastopol: O'Reilly Media, 2015.
- TAPIA, F. *et al.* From monolithic systems to microservices: a comparative study of performance. **Applied Sciences**, v. 10, n. 17, art. 5797, 2020. DOI: 10.3390/app10175797.
- TU, Z. Research on the application of layered architecture in computer software development. **Journal of Computing and Electronic Information Management**, v. 11, n. 3, p. 34-38, 2023. DOI: 10.54097/jceim.v11i3.08.
- VELEPUCHA, V.; FLORES, P. A survey on microservices architecture: principles, patterns and migration challenges. **IEEE Access**, v. 11, p. 88339-88358, 2023. DOI: 10.1109/ACCESS.2023.3305687.

*Versão em APA (exigida pelas Diretrizes do 21º CONTECSI), caso a coordenação confirme esse padrão: a lista completa de autores foi conferida nos PDFs e consta no histórico do commit `007ee33`.*

## Verificação dos metadados

Os nomes completos dos autores e os DOIs de Abgaz *et al.*, Blinowski *et al.*, Di Francesco *et al.*, Tapia *et al.*, Velepucha e Flores foram conferidos **na primeira página dos PDFs** arquivados no repositório. O DOI e os dados de Tu (2023) coincidem com o registrado em [tarefa04-referencias.md](../../../referencias/tarefa04-referencias.md).

**Correções em relação às notas anteriores do repositório:**

| Obra | Nas notas anteriores | No PDF | Onde corrigir |
|---|---|---|---|
| Tapia *et al.* (2020) | "Eduardo Flores" | **Edwin Flores** | [publicacao/trechos-para-o-artigo.md](../../trechos-para-o-artigo.md), Bloco 4 |
| Tu (2023) | "Zhenxing Tu" | **Zhenan Tu** | [publicacao/trechos-para-o-artigo.md](../../trechos-para-o-artigo.md), Bloco 4 |

A inicial do primeiro autor (F. e Z.) não muda, então as referências do resumo da Atividade 07 continuam corretas. Só as notas de apoio estão imprecisas, e **não foram alteradas** neste commit.

**Não verificados no texto original** (obras de livro, sem PDF no repositório): Bass, Clements e Kazman (2012); Dragoni *et al.* (2017), cuja lista completa de autores foi preenchida de memória e deve ser conferida; Fowler (2002); Garlan e Shaw (1993); Martin (2017); Newman (2015); Richards (2015). A afirmação atribuída a Fowler (2002) sobre decisões baseadas em preferências e relatos anedóticos vem do texto da Atividade 07 e não foi revalidada nesta atividade.

**Referência descartada.** A entrada IJCSE (2024), não verificável, apontada em [trechos-para-o-artigo.md](../../trechos-para-o-artigo.md) (item 5.1), **não é usada** neste manuscrito.

---

## Fontes de regras e exemplos

| Fonte | Uso |
|---|---|
| [Diretrizes para Autores — 21º CONTECSI](https://contecsi.tecsi.org/index.php/contecsi/21CONTECSI/about/submissions#authorGuidelines) | Formatação, estrutura da primeira página, metadados, padrão APA, regras de IA |
| [Políticas das Modalidades — 21º CONTECSI](https://contecsi.tecsi.org/index.php/contecsi/21CONTECSI/schedConf/trackPolicies) | Limites do REX (5 a 8 páginas), elegibilidade |
| [Nova submissão — 21º CONTECSI](https://contecsi.tecsi.org/index.php/contecsi/21CONTECSI/author/submit) | Passos 1 a 5, tipos de sessão, declarações |
| [20º CONTECSI, trilha 115 (REX)](https://contecsi.tecsi.org/index.php/contecsi/20CONTECSI/schedConf/presentations?searchField=&searchMatch=&search=&track=115) | Exemplos REX: trabalhos 7207 e 7219 |
| [20º CONTECSI, trilha 110 (PSE)](https://contecsi.tecsi.org/index.php/contecsi/20CONTECSI/schedConf/presentations?searchField=&searchMatch=&search=&track=110) | Indicada no enunciado como REX; contém artigos completos |
| [Template de referência (Google Docs)](https://docs.google.com/document/d/1C4jklGs0GD4qqeRCcdU-DnKSme6qe6ZT6-KXR0ltxfE/edit?tab=t.0) | Template REX do 1º Congresso CONTECSI, Trilha de Graduação (2024); base de formatação do manuscrito |
| Atividade 06 — [tarefa06-publicacao.md](../../tarefa06-publicacao.md) | Levantamento dos trabalhos correlatos |
| Atividade 07 — [tarefa07-congresso.md](../../tarefa07-congresso.md) | Resumo expandido que originou o manuscrito |
