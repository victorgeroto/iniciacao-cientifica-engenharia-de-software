# Trabalho CONTECSI — Atividade 09

**Projeto:** Comparativo Arquitetural: Monólito, Arquitetura em Camadas (MVC) e Clean Architecture em Sistemas Escaláveis
**Aluno:** Victor Hugo Geroto Toledo
**Orientadores:** Deivison Takatu; Glauco Todesco
**Instituição:** Centro Universitário SENAI São Paulo — UNISENAI-SP, Campus Sorocaba
**Evento:** 21º CONTECSI — International Conference on Information Systems and Technology Management (USP)
**Data deste registro:** 03/11/2026

---

## Situação

| Item | Situação |
|---|---|
| Manuscrito | ✅ Pronto para revisão — 7 páginas |
| Revisão dos orientadores | ⬜ Pendente |
| Template oficial REX do 21º CONTECSI | ⚠️ Não publicado pela organização — ver [Template](#template) |
| Submissão no sistema | ⬜ **Não realizada** |
| Data da submissão / código de confirmação | — (a preencher após o envio) |

**Prazo oficial da chamada: 10/11/2026.**

---

## Modalidade selecionada

**REX — Extended Abstract (Resumo Expandido)**, tipo de sessão **09 – ESD** (Engenharia e Desenvolvimento de Software e Hardware).

### Justificativa da escolha

A atividade recomenda PSE e admite o REX apenas com justificativa acadêmica. A justificativa é:

1. **Estágio da pesquisa.** O PSE exige "pesquisa completa, robusta, com [...] análise completa dos resultados" (Políticas das Modalidades, 21º CONTECSI). A pesquisa está em especificação arquitetural e planejamento experimental: o protótipo tripartido ainda não foi implementado e **não há métricas coletadas**. Um PSE exigiria apresentar resultados inexistentes, o que a atividade proíbe. Esta é a limitação concreta do estágio atual da pesquisa a que o enunciado se refere.
2. **Elegibilidade.** O REX é restrito a graduandos e exige que o primeiro autor seja estudante e que o orientador conste como coautor. O autor cursa Análise e Desenvolvimento de Sistemas, e os dois orientadores serão coautores.
3. **Tamanho.** O REX admite de 5 a 8 páginas; o manuscrito tem 7.

A alternativa COM (Pesquisa em Andamento, 8 a 25 páginas) não está entre as opções da atividade. **A escolha do REX ainda deve ser confirmada com os orientadores**, como pede o enunciado.

---

## Título

**Título definitivo (a validar com os orientadores):**
Comparativo Arquitetural: Monólito, Arquitetura em Camadas (MVC) e Clean Architecture em Sistemas Escaláveis

**Title:**
Architectural Comparison: Monolith, Layered Architecture (MVC) and Clean Architecture in Scalable Systems

## Contribuição científica

O estudo propõe um **desenho experimental controlado** que isola o padrão arquitetural como única variável independente: a mesma aplicação de gerenciamento de tarefas, desenvolvida três vezes (Monólito, Camadas/MVC e Clean Architecture), com mesma linguagem, banco e infraestrutura AWS.

A literatura revisada compara majoritariamente monólito contra microsserviços e trata Camadas e Clean Architecture como boas práticas de estruturação interna, não como objetos de comparação empírica. A contribuição **consolidada até agora** é a delimitação dessa lacuna e o protocolo experimental. A contribuição **esperada**, dependente da coleta ainda não executada, são diretrizes baseadas em evidências para a escolha do padrão conforme o contexto do projeto. O manuscrito declara esse estágio e não apresenta dados de desempenho.

---

## Template

| Origem | Situação |
|---|---|
| Página "Políticas das Modalidades" do 21º CONTECSI | O texto "Acesse o template – modelo" da seção REX **não tem hiperlink** (verificado no HTML da página em 03/11/2026). Só os templates COM têm link. |
| Edições anteriores (12º a 20º) | Nenhuma lista link de REX, exceto o 19º (2022), cujo arquivo retorna 404. |
| Google Docs indicado na atividade | É o modelo "template_artigo 2024" de uma revista da Fatec Itapetininga (Arial, ABNT, 10 a 20 páginas, autores na primeira página). **Não foi usado como base de formatação**, porque contradiz as diretrizes do CONTECSI. |

Links:

- Template de referência (Google Docs): https://docs.google.com/document/d/1C4jklGs0GD4qqeRCcdU-DnKSme6qe6ZT6-KXR0ltxfE/edit?tab=t.0
- Políticas das Modalidades — 21º CONTECSI: https://contecsi.tecsi.org/index.php/contecsi/21CONTECSI/schedConf/trackPolicies
- Diretrizes para autores — 21º CONTECSI: https://contecsi.tecsi.org/index.php/contecsi/21CONTECSI/about/submissions#authorGuidelines

**Como o manuscrito foi formatado.** Sem o template oficial, o texto segue as regras gerais das Diretrizes e da página de modalidades: A4, Times New Roman 12, espaço 1,5, margens de 3 cm (superior e esquerda) e 2,5 cm (inferior e direita), primeira página com título em inglês seguido do português, Abstract e Resumo (até 200 palavras cada) e palavras-chave, figuras e quadros no corpo do texto, referências em ordem alfabética no padrão APA e arquivo sem nomes de autores. Quando o template oficial for obtido, o conteúdo deve ser transposto para ele: a primeira página é a parte que muda.

**Pendência.** Pedir o template REX do 21º CONTECSI à coordenação (contecsiusp@gmail.com) e conferir com os orientadores se eles têm o modelo.

---

## Exemplos consultados (20º CONTECSI)

O enunciado indica a trilha 110 como REX e a 115 como artigo completo. **Na página do 20º CONTECSI, a correspondência está invertida**: os DOIs dos trabalhos mostram que a trilha 115 contém REX e a 110 contém PSE.

| Trabalho | Modalidade | Link |
|---|---|---|
| DivDados: aplicativo para controle financeiro | REX / ESD (trilha 115) | https://contecsi.tecsi.org/index.php/contecsi/20CONTECSI/paper/view/7207 |
| Desigualdade salarial entre homens e mulheres na TI: uma análise descritiva de dados com Python | REX / DSC (trilha 115) | https://contecsi.tecsi.org/index.php/contecsi/20CONTECSI/paper/view/7219 |

Dois trabalhos da trilha 110 (7258 e 7236) também foram abertos e verificados como PSE, e por isso **não** foram usados como modelo de REX.

**O que se observou nos REX:**

- Ocupam 8 páginas mais uma capa dos anais; seções 1 Introdução, 2 Metodologia, 3 Desenvolvimento, 4 Resultados obtidos, 5 Considerações finais e Referências.
- A primeira página traz o cabeçalho "MODALIDADE RESUMO EXPANDIDO – GRADUAÇÃO", título em português e inglês, Resumo e Abstract, e **a identificação dos autores** (nome, ORCID, instituição, e-mail), com o orientador e a coorientadora como coautores.
- As referências dos dois exemplos seguem ABNT, enquanto as Diretrizes do 21º CONTECSI pedem APA. Seguiu-se o texto vigente das diretrizes.
- Apresentam figuras e telas no corpo do texto e declaram o escopo do que foi feito.

> **Ponto a decidir.** Os exemplos REX do 20º CONTECSI trazem os autores na primeira página, enquanto as diretrizes do 21º exigem arquivo sem identificação (e a declaração do formulário de submissão afirma isso). O manuscrito foi gerado **sem identificação**, que é a versão segura. Se o template REX oficial pedir o bloco de autores, ele deve ser acrescentado.

---

## Adaptações em relação ao resumo da Atividade 07

O manuscrito parte do resumo expandido do III Congresso UniSENAI-SP ([docs/artigos/ResumoExpandido](../../docs/artigos/ResumoExpandido/)), reorganizado para as regras do CONTECSI.

| Mudança | Motivo |
|---|---|
| Referências e citações em APA | Exigência das Diretrizes do CONTECSI; a lista passou a ter todos os autores e DOI |
| Removidos autores, biografias, fotografias e agradecimentos | Arquivo sem identificação de autoria |
| Título em inglês antes do português; Abstract antes do Resumo | Estrutura da primeira página exigida |
| Palavras-chave reduzidas a 5 | Limite do campo de metadados; as de nuvem/AWS ficaram fora |
| Figura 2 virou o **Quadro 1** em tabela nativa do Word | As Diretrizes pedem quadros em Word; o rótulo de hipótese foi mantido |
| Retirada a frase de que Blinowski *et al.* e Tapia *et al.* mostram efeito na "complexidade ciclomática" | Esses estudos medem desempenho; a atribuição não se sustentava |
| Retirada a expressão "inferno de dependências" atribuída a Dragoni *et al.* | Atribuição não verificada |
| Texto condensado (seções 1.1 a 1.3, Revisão de Literatura e Resultados) | Manter 7 páginas, no limite de 5 a 8, sem cortar a lacuna, a metodologia nem as limitações |

O manuscrito **não contém resultados experimentais**, e nenhum dado foi inventado.

---

## Uso de inteligência artificial — pendente de decisão

As Diretrizes do 21º CONTECSI exigem que trechos produzidos com IA fiquem entre aspas, com a ferramenta identificada, segundo a Portaria CNPq nº 2.664/2026. A adaptação deste manuscrito foi feita com apoio do Claude (Anthropic) a partir do texto da Atividade 07. **O autor deve revisar o texto integralmente, assumir o conteúdo e decidir, com os orientadores, como registrar esse uso antes de submeter.**

---

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| [manuscrito/resumo-expandido.docx](manuscrito/resumo-expandido.docx) | Manuscrito editável, sem identificação de autoria |
| [manuscrito/resumo-expandido.pdf](manuscrito/resumo-expandido.pdf) | Exportação para revisão. **Não é a versão submetida.** |
| [metadados-submissao.md](metadados-submissao.md) | Dados a preencher nos 5 passos do sistema e checklist das declarações |
| [referencias/fontes-e-trabalhos-relacionados.md](referencias/fontes-e-trabalhos-relacionados.md) | Fontes citadas, verificação e correções de metadados |

---

## Requisitos mínimos

| Requisito | Situação |
|---|---|
| Escolher uma modalidade e verificar elegibilidade | ✅ REX; elegível como graduando |
| Priorizar PSE, exceto com justificativa para REX | ✅ Justificativa registrada; confirmar com orientadores |
| Consultar pelo menos dois exemplos da edição anterior | ✅ 2 REX (7207 e 7219) |
| Localizar e utilizar o template da modalidade | ⚠️ Template oficial indisponível; seguidas as regras gerais |
| Desenvolver o manuscrito com base no projeto de IC | ✅ |
| Revisar metodologia, resultados, conclusões e referências | ✅ 14 citações no texto = 14 referências |
| Conferir regras de autoria, formatação e avaliação cega | ✅ Arquivo sem identificação |
| Preparar os metadados da plataforma | ✅ [metadados-submissao.md](metadados-submissao.md) |
| Registrar no GitHub a versão de trabalho e os links | ✅ |
| Realizar a submissão | ⬜ Pendente — prazo 10/11/2026 |
| Registrar confirmação ou documentar a pendência | ⚠️ Pendência documentada abaixo |

## Pendências e plano de conclusão

| # | O que falta | Quem |
|---|---|---|
| 1 | Confirmar REX e a lista e ordem de autores com Deivison Takatu e Glauco Todesco | Aluno |
| 2 | Enviar o manuscrito aos orientadores para revisão | Aluno |
| 3 | Obter o template REX do 21º CONTECSI (e-mail à coordenação) e transpor o texto | Aluno |
| 4 | Definir a declaração de uso de IA | Aluno e orientadores |
| 5 | Obter o ORCID dos três autores (obrigatório) | Aluno e orientadores |
| 6 | Cadastrar-se no sistema, marcar o perfil "Autor" e submeter pelos 5 passos | Aluno |
| 7 | Registrar aqui a data e o código de 4 dígitos da submissão | Aluno |
