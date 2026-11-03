# Fontes e trabalhos relacionados — Atividade 09

Fontes citadas no manuscrito [`resumo-expandido.docx`](../manuscrito/resumo-expandido.docx), exibidas no padrão APA exigido pelas Diretrizes do 21º CONTECSI, mais as fontes de regras e exemplos consultados.

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

## Referências do manuscrito (APA)

- Abgaz, Y., McCarren, A., Elger, P., Solan, D., Lapuz, N., Bivol, M., Jackson, G., Yilmaz, M., Buckley, J., & Clarke, P. (2023). Decomposition of monolith applications into microservices architectures: A systematic review. *IEEE Transactions on Software Engineering*, *49*(8), 4213–4242. https://doi.org/10.1109/TSE.2023.3287297
- Amazon Web Services. (2023). *AWS Well-Architected Framework*. Recuperado em 20 de maio de 2026, de https://aws.amazon.com/architecture/well-architected/
- Bass, L., Clements, P., & Kazman, R. (2012). *Software architecture in practice* (3rd ed.). Addison-Wesley.
- Blinowski, G., Ojdowska, A., & Przybyłek, A. (2022). Monolithic vs. microservice architecture: A performance and scalability evaluation. *IEEE Access*, *10*, 20357–20374. https://doi.org/10.1109/ACCESS.2022.3152803
- Di Francesco, P., Lago, P., & Malavolta, I. (2019). Architecting with microservices: A systematic mapping study. *Journal of Systems and Software*, *150*, 77–97. https://doi.org/10.1016/j.jss.2019.01.001
- Dragoni, N., Giallorenzo, S., Lluch Lafuente, A., Mazzara, M., Montesi, F., Mustafin, R., & Safina, L. (2017). Microservices: Yesterday, today, and tomorrow. In M. Mazzara & B. Meyer (Eds.), *Present and ulterior software engineering* (pp. 195–216). Springer.
- Fowler, M. (2002). *Patterns of enterprise application architecture*. Addison-Wesley.
- Garlan, D., & Shaw, M. (1993). An introduction to software architecture. In V. Ambriola & G. Tortora (Eds.), *Advances in software engineering and knowledge engineering* (pp. 1–39). World Scientific Publishing.
- Martin, R. C. (2017). *Clean architecture: A craftsman's guide to software structure and design*. Prentice Hall.
- Newman, S. (2015). *Building microservices: Designing fine-grained systems*. O'Reilly Media.
- Richards, M. (2015). *Software architecture patterns*. O'Reilly Media.
- Tapia, F., Mora, M. Á., Fuertes, W., Aules, H., Flores, E., & Toulkeridis, T. (2020). From monolithic systems to microservices: A comparative study of performance. *Applied Sciences*, *10*(17), Article 5797. https://doi.org/10.3390/app10175797
- Tu, Z. (2023). Research on the application of layered architecture in computer software development. *Journal of Computing and Electronic Information Management*, *11*(3), 34–38. https://doi.org/10.54097/jceim.v11i3.08
- Velepucha, V., & Flores, P. (2023). A survey on microservices architecture: Principles, patterns and migration challenges. *IEEE Access*, *11*, 88339–88358. https://doi.org/10.1109/ACCESS.2023.3305687

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
| [Template de referência (Google Docs)](https://docs.google.com/document/d/1C4jklGs0GD4qqeRCcdU-DnKSme6qe6ZT6-KXR0ltxfE/edit?tab=t.0) | Modelo Fatec Itapetininga 2024; apenas referência de seções, não de formatação |
| Atividade 06 — [tarefa06-publicacao.md](../../tarefa06-publicacao.md) | Levantamento dos trabalhos correlatos |
| Atividade 07 — [tarefa07-congresso.md](../../tarefa07-congresso.md) | Resumo expandido que originou o manuscrito |
