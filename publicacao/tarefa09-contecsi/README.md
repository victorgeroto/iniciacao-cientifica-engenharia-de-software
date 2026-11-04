# Trabalho CONTECSI — Atividade 09

**Projeto:** Comparativo Arquitetural: Monólito, Arquitetura em Camadas (MVC) e Clean Architecture em Sistemas Escaláveis
**Aluno:** Victor Hugo Geroto Toledo
**Orientadores:** Deivison Takatu; Glauco Todesco
**Instituição:** Centro Universitário SENAI São Paulo — UNISENAI-SP, Campus Sorocaba
**Evento:** 21º CONTECSI — International Conference on Information Systems and Technology Management (USP)
**Data deste registro:** 04/11/2026

---

## Situação

| Item | Situação |
|---|---|
| Manuscrito no template REX | ✅ Pronto para revisão — 6 páginas |
| Campos pessoais do bloco de autores (ORCID, CPF, e-mail) | ⬜ A preencher localmente; **não versionar** |
| Revisão dos orientadores | ⬜ Pendente |
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
3. **Tamanho.** O REX admite de 5 a 8 páginas; o manuscrito tem 6.

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

## Template utilizado

O manuscrito foi escrito no template **"template_artigo 2024"**, indicado pela atividade como referência. O cabeçalho do PDF desse modelo o identifica como o template do **1º Congresso CONTECSI — Trilha de Graduação (29 a 31 de outubro de 2024), "Modalidade Artigo (REX) – Graduação"**, ou seja, um modelo de REX do ecossistema CONTECSI. Ele **não é o template oficial do 21º CONTECSI**: a página de modalidades do 21º não publica o link do template REX (o texto "Acesse o template – modelo" não tem hiperlink, verificado no HTML em 03/11/2026).

- Template de referência (Google Docs): https://docs.google.com/document/d/1C4jklGs0GD4qqeRCcdU-DnKSme6qe6ZT6-KXR0ltxfE/edit?tab=t.0
- Políticas das Modalidades — 21º CONTECSI: https://contecsi.tecsi.org/index.php/contecsi/21CONTECSI/schedConf/trackPolicies
- Diretrizes para autores — 21º CONTECSI: https://contecsi.tecsi.org/index.php/contecsi/21CONTECSI/about/submissions#authorGuidelines

### O que do template foi aplicado

| Item | Aplicação |
|---|---|
| Cabeçalho | Logotipos TECSI e CONTECSI/USP e a linha "Modalidade Resumo Expandido (REX) – Graduação" em todas as páginas. Os textos do evento foram adaptados para "21º CONTECSI", **sem datas**, que o 21º ainda não informa |
| Fonte e espaçamento | Arial 12, espaço 1,5, texto justificado, primeira linha com recuo de 1,25 cm; referências, legendas e fontes em espaço simples |
| Margens | 3 cm (superior e esquerda) e 2 cm (inferior e direita) |
| Páginas | Sem numeração |
| Primeira página | Título em português e em inglês, bloco de autores (nome, ORCID, CPF, instituição, e-mail), Resumo (174 palavras, limite de 250, parágrafo único), palavras-chave (5, em ordem alfabética, sem repetir termos do título), Abstract e Keywords |
| Estrutura | 1 Introdução (com problema e objetivo no final), 2 Metodologia, 3 Referencial teórico, 4 Resultados e discussão, 5 Considerações finais, Referências bibliográficas, nessa ordem |
| Introdução | 1.522 caracteres (limite de 2.500) |
| Ilustrações | Legenda acima em negrito, fonte abaixo em Arial 10; quadro em tabela nativa do Word, sem sombreado e sem linhas verticais |
| Referências e citações | ABNT (NBR 6023 e NBR 10520/2023), ordem alfabética, *et al.* em itálico |

### Divergências entre o template e as Diretrizes do 21º CONTECSI

O template e as Diretrizes se contradizem em pontos que afetam a submissão. Nesta versão **prevaleceu o template**, e a tabela mostra o que mudaria se a organização exigir o contrário.

| Ponto | Template | Diretrizes 21º CONTECSI | Adotado |
|---|---|---|---|
| Fonte | Arial 12 | Times New Roman 12 | Template |
| Margens inferior e direita | 2 cm | 2,5 cm | Template |
| Referências e citações | ABNT | APA | Template (os dois REX de 2024 consultados também usam ABNT) |
| Autores no arquivo | Bloco com ORCID, CPF e e-mail na primeira página | Arquivo sem nomes nem filiação | Duas versões (ver abaixo) |
| Número de páginas | 10 a 20 | REX: 5 a 8 | **Diretrizes** (6 páginas); o limite do template é o de uma revista, e os REX de 2024 têm 8 páginas |

As Diretrizes também afirmam que os templates valem para a **primeira página**, e que as demais seguem as recomendações gerais. A forma segura de decidir é **perguntar à coordenação** (contecsiusp@gmail.com), junto com o pedido do template oficial do 21º.

### Duas versões do manuscrito

| Arquivo | Uso |
|---|---|
| `template_artigo_2024_comparativo_arquitetural.docx` | Template completo, **com** bloco de autores. ORCID, CPF e e-mail aparecem como `[preencher]` |
| `template_artigo_2024_comparativo_arquitetural_sem-autores.docx` | Mesmo texto **sem** o bloco de autores, para o caso de o sistema exigir avaliação sem identificação |

ORCID, CPF e e-mail **não estão no repositório de propósito**. Preencha no `.docx` local antes de enviar e não faça commit dessa versão.

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
- A primeira página traz o cabeçalho "MODALIDADE RESUMO EXPANDIDO – GRADUAÇÃO", título em português e inglês, Resumo e Abstract e **a identificação dos autores** (nome, ORCID, instituição, e-mail), com o orientador e a coorientadora como coautores.
- As referências dos dois exemplos seguem ABNT.
- Apresentam figuras e telas no corpo do texto e declaram o escopo do que foi feito.

---

## Adaptações em relação ao resumo da Atividade 07

O manuscrito parte do resumo expandido do III Congresso UniSENAI-SP ([docs/artigos/ResumoExpandido](../../docs/artigos/ResumoExpandido/)), reorganizado para o template do CONTECSI.

| Mudança | Motivo |
|---|---|
| Ordem das seções do template: Metodologia antes do Referencial teórico; Problema, Objetivo e Justificativa fundidos na Introdução | Template e limite de 2.500 caracteres na Introdução |
| Resumo reescrito (objetivo, metodologia, resultados parciais, expectativa) | O template pede resumo com objetivos, metodologia, resultados e conclusões, sem introdução e sem citações |
| Palavras-chave trocadas por 5 termos que **não** constam do título, em ordem alfabética | Regra do template |
| Removidas as biografias em notas, as fotografias e os agradecimentos | O template usa bloco de autores, e não notas de rodapé |
| Figura 2 virou o **Quadro 1**, em tabela nativa do Word | O template pede quadros e tabelas no recurso do Word; o rótulo de hipótese foi mantido |
| Retirada a frase de que Blinowski *et al.* e Tapia *et al.* mostram efeito na "complexidade ciclomática" | Esses estudos medem desempenho; a atribuição não se sustentava |
| Retirada a expressão "inferno de dependências" atribuída a Dragoni *et al.* | Atribuição não verificada |
| Considerações finais reescritas em função do objetivo | O template pede que elas não repitam resultados e se fundamentem nos objetivos |

O manuscrito **não contém resultados experimentais**, e nenhum dado foi inventado.

**Não aplicado:** a seção 4.1.1 do template pede a origem (marca, cidade e país) de programas e equipamentos citados. Isso não foi detalhado para Docker, Apache JMeter, Grafana e demais ferramentas, para não registrar dados de sede sem verificação. Conferir com os orientadores se é exigido.

---

## Uso de inteligência artificial — pendente de decisão

As Diretrizes do 21º CONTECSI exigem que trechos produzidos com IA fiquem entre aspas, com a ferramenta identificada, segundo a Portaria CNPq nº 2.664/2026. A adaptação deste manuscrito foi feita com apoio do Claude (Anthropic) a partir do texto da Atividade 07. **O autor deve revisar o texto integralmente, assumir o conteúdo e decidir, com os orientadores, como registrar esse uso antes de submeter.**

---

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| [manuscrito/template_artigo_2024_comparativo_arquitetural.docx](manuscrito/template_artigo_2024_comparativo_arquitetural.docx) | Manuscrito no template, com bloco de autores (campos pessoais a preencher) |
| [manuscrito/template_artigo_2024_comparativo_arquitetural_sem-autores.docx](manuscrito/template_artigo_2024_comparativo_arquitetural_sem-autores.docx) | Mesmo texto, sem bloco de autores |
| [manuscrito/template_artigo_2024_comparativo_arquitetural.pdf](manuscrito/template_artigo_2024_comparativo_arquitetural.pdf) e [versão sem autores](manuscrito/template_artigo_2024_comparativo_arquitetural_sem-autores.pdf) | Exportações para revisão. **Não são a versão submetida.** |
| [metadados-submissao.md](metadados-submissao.md) | Dados a preencher nos 5 passos do sistema e checklist das declarações |
| [referencias/fontes-e-trabalhos-relacionados.md](referencias/fontes-e-trabalhos-relacionados.md) | Fontes citadas, verificação e correções de metadados |

---

## Requisitos mínimos

| Requisito | Situação |
|---|---|
| Escolher uma modalidade e verificar elegibilidade | ✅ REX; elegível como graduando |
| Priorizar PSE, exceto com justificativa para REX | ✅ Justificativa registrada; confirmar com orientadores |
| Consultar pelo menos dois exemplos da edição anterior | ✅ 2 REX (7207 e 7219) |
| Localizar e utilizar o template da modalidade | ⚠️ Usado o template REX de 2024 indicado pela atividade; o oficial do 21º não tem link publicado |
| Desenvolver o manuscrito com base no projeto de IC | ✅ |
| Revisar metodologia, resultados, conclusões e referências | ✅ 14 citações no texto = 14 referências |
| Conferir regras de autoria, formatação e avaliação cega | ⚠️ Template e Diretrizes divergem; duas versões geradas |
| Preparar os metadados da plataforma | ✅ [metadados-submissao.md](metadados-submissao.md) |
| Registrar no GitHub a versão de trabalho e os links | ✅ |
| Realizar a submissão | ⬜ Pendente — prazo 10/11/2026 |
| Registrar confirmação ou documentar a pendência | ⚠️ Pendência documentada abaixo |

## Pendências e plano de conclusão

| # | O que falta | Quem |
|---|---|---|
| 1 | Confirmar REX e a lista e ordem de autores com Deivison Takatu e Glauco Todesco | Aluno |
| 2 | Enviar o manuscrito aos orientadores para revisão | Aluno |
| 3 | Perguntar à coordenação qual formato vale (template × Diretrizes) e pedir o template REX do 21º | Aluno |
| 4 | Preencher ORCID, CPF e e-mail no `.docx` local (sem commit) | Aluno e orientadores |
| 5 | Definir a declaração de uso de IA | Aluno e orientadores |
| 6 | Cadastrar-se no sistema, marcar o perfil "Autor" e submeter pelos 5 passos | Aluno |
| 7 | Registrar aqui a data e o código de 4 dígitos da submissão | Aluno |
