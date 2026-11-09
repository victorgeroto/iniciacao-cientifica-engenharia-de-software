# Banner científico — Atividade 08 (versão preliminar)

**Projeto:** Estruturação interna de aplicações monolíticas: comparação entre módulo único, arquitetura em camadas (MVC) e Clean Architecture
**Aluno:** Victor Hugo Geroto Toledo
**Orientadores:** Deivison Shindi Takatu; Glauco Todesco
**Instituição:** Centro Universitário SENAI São Paulo — UNISENAI-SP, Campus Sorocaba
**Situação:** versão preliminar (v1), à espera das regras oficiais do evento
**Registro:** 08/11/2026

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| [banner-v1.pdf](banner-v1.pdf) | Banner em PDF, A0 retrato (84,1 × 118,9 cm), uma página |
| [banner-v1.pptx](banner-v1.pptx) | Arquivo editável. Os gráficos e a tabela são **nativos** (clique com o botão direito → *Editar dados*) |

## Template

| Item | Registro |
|---|---|
| **Modelo usado** | Layout acadêmico de três colunas, construído do zero: faixa de título e autores, colunas "contexto e método", "resultados" e "código e conclusões", e rodapé com referências e agradecimentos |
| **Canva** | A atividade lista o Canva como fonte. **Não foi usado**: o conector do Canva exige autorização que não existe nesta sessão e o site bloqueia acesso automatizado. A busca de modelos acadêmicos é https://www.canva.com/templates/s/academic-poster/ (endereço não verificado automaticamente, conferir manualmente). Para levar este banner ao Canva, use **Criar um design → Importar arquivo → `banner-v1.pptx`** |
| **Ferramenta de edição** | Python (`python-pptx`) para montar e PowerPoint para medir os textos e exportar o PDF |
| **Natureza** | Provisório. Dimensões, cores e organização **não são exigências** do III Congresso UniSENAI-SP |

## Organização visual

- **Título legível à distância** (76 pt, branco sobre azul-marinho) e autores e instituição logo abaixo.
- **Leitura em três colunas, da esquerda para a direita**, na ordem do método científico: introdução, problema e objetivo, metodologia, resultados, discussão e conclusões. Cada seção tem uma barra de título.
- **Frases curtas em tópicos** (34 pt) em vez de parágrafos, e o texto do resumo não foi copiado integralmente.
- **Resultados em destaque** no centro: dois gráficos (throughput por cenário e sob carga crescente), cada um com legenda e fonte.
- **As três versões têm sempre a mesma cor e o mesmo nome** (A azul, B âmbar, C violeta). O nome acompanha a cor em legendas e rótulos, então a cor não é o único sinal.
- **Diagrama do ambiente** feito com formas nativas e letras grandes, no lugar de uma imagem reduzida.
- **Contraste alto** em todo o texto (escuro sobre branco; branco sobre azul-marinho).

## Conferência (Parte 4 da atividade)

| Item | Situação |
|---|---|
| Título e autores correspondem ao trabalho submetido | ⚠️ **Divergem de propósito.** O resumo da Tarefa 07 ("Comparativo Arquitetural: Monólito, Arquitetura em Camadas (MVC) e Clean Architecture…") foi **não aprovado** e a pesquisa foi reformulada, porque monólito é forma de implantação e não alternativa a MVC ou Clean. O banner usa o título e os resultados reformulados, os mesmos do artigo preparado para o 21º CONTECSI. Autores e orientadores são os mesmos |
| Problema e objetivos claros | ✅ |
| Metodologia compreensível | ✅ Figura 1 e quatro tópicos |
| Resultados verdadeiros | ✅ Todos os números saem de `data/tratado/*.csv`. A geração **falha** se os dados contrariarem uma afirmação do texto |
| Conclusões sem exagero | ✅ Declara o que **não** se confirmou (acoplamento por fan-out cresceu; a diferença de escalabilidade em 100 conexões não resiste à correção de Bonferroni) e os limites (mesmo hospedeiro, CV até 29%, n = 5) |
| Referências identificadas | ✅ Cinco referências essenciais no rodapé |
| Legível e organizado | ✅ Conferido no PDF final, sem sobreposição de textos |

## Pendências quando o evento publicar as regras oficiais

A página do evento ([Even3](https://www.even3.com.br/iiicongressounisenai-sp-721261/)) foi consultada em 08/11/2026. Informa que os trabalhos aprovados serão apresentados em **painel/banner** ou oral e que **os autores são responsáveis pela impressão**, mas **não publica dimensões, orientação nem modelo**.

- [ ] **Dimensões e orientação** (hoje A0 retrato, provisório). O gerador aceita outro tamanho alterando `W` e `H`.
- [ ] **Formato de entrega:** arquivo para envio ou impressão.
- [ ] **Logotipos e identidade visual** do congresso e da instituição. Não foram incluídos porque não há modelo oficial.
- [ ] **Seções obrigatórias** e **regras de autoria**.
- [ ] **Agradecimentos e apoio financeiro:** hoje só agradece aos orientadores e à instituição. Se houver bolsa ou apoio, os orientadores devem confirmar a redação.
- [ ] **Não imprimir** antes de confirmar tamanho e regras.
- [ ] Se os orientadores aprovarem o novo título, avisar a organização para que o título publicado no evento corresponda ao do banner.
