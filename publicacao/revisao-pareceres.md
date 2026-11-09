# Resposta aos pareceres

**Trabalho:** submissão 1824359 — III Congresso UniSENAI-SP (não aprovado), e anotações do professor sobre o PDF do resumo expandido para o 21º CONTECSI.
**Registro:** 08/11/2026

## Observação do professor

> É necessário esclarecer a classificação conceitual dos modelos comparados. Monólito se refere principalmente à forma de organização e implantação, enquanto MVC e Clean Architecture dizem respeito à estruturação interna do software. Uma aplicação monolítica pode utilizar qualquer uma dessas abordagens. Recomenda-se rever o enquadramento da comparação para evitar tratar conceitos de níveis diferentes como alternativas mutuamente excludentes.

**Correção:** as três versões do protótipo são **monólitos** (um artefato, um banco). O monólito passou a ser o **contexto comum**, e a variável estudada é a **estruturação interna**: módulo único, arquitetura em camadas (MVC) e Clean Architecture. A Seção 3.1 do manuscrito distingue explicitamente os dois níveis. Título, resumo, introdução e metodologia foram reescritos nesse enquadramento.

## Parecer do UniSENAI

| # | Crítica | Resposta | Onde |
|---|---|---|---|
| 1 | Comparação conceitualmente inadequada | Corrigido, como acima | Título, resumo, seções 1, 2 e 3.1 |
| 2 | Ausência de resultados experimentais | Protótipo concluído e experimento executado: 12 condições × 5 rodadas × 3 versões = 180 medições, com Kruskal-Wallis e correção de Bonferroni | Seção 4; dados em `data/` |
| 3 | Objetivos e métricas desalinhados | "Integração" saiu dos objetivos. Cada dimensão tem métrica: desempenho (throughput, latência, CPU por requisição), escalabilidade (carga e CPU), manutenibilidade (cobertura da regra de negócio, fan-out, dependência de frameworks) | Seções 1, 2 e 4 |
| 4 | Escalabilidade não demonstrada | Protocolo executado: 1 a 100 conexões e 0,5 a 2 vCPU. Escala horizontal **não** foi avaliada e consta como trabalho futuro | Seção 4, Tabela 2 |
| 5 | Data de aprovação anterior à submissão | O texto não tinha data. A causa provável eram os **metadados do arquivo**: o `.docx` do UniSENAI trazia datas de 2024 e 2022, herdadas do modelo da revista. Os arquivos atuais saem com a data real da geração e sem autor | `gerar_manuscrito.py` |

## Marcações do professor no PDF do CONTECSI

| Trecho marcado | Correção |
|---|---|
| Cabeçalho do evento | Datas (01 a 04/12/2026), organização e formato (presencial 01/12, virtual 02 a 04/12), conforme o site |
| "Poucos estudos comparam…" | Passou a "Nas fontes revisadas (Seção 3.2), não foram encontrados estudos…" |
| Objetivo | Sem AWS, "integração" e "painel em tempo real", que não foram feitos |
| "…(AWS) permanecem constantes" e parágrafo EC2/ECS/RDS/JMeter/Grafana | Substituídos pelo ambiente real: Docker em um hospedeiro, autocannon |
| Figura 1 | Nova figura do ambiente real |
| Hipótese e Quadro 1 | Substituídos por resultados medidos (Tabelas 1 a 3) |
| "RESUMO:" | Reenquadrado, como na observação acima |

## Ressalvas que o artigo declara

- O gerador de carga, as APIs e os bancos dividem o mesmo computador, e o coeficiente de variação do throughput chegou a 20% nos cenários e a 29% na escalabilidade; isso limita o poder dos testes.
- Com 5 rodadas por condição, "sem diferença significativa" **não prova equivalência**.
- A diferença de escalabilidade em 100 conexões (p = 0,042) não resiste à correção de Bonferroni; a de criação de tarefas (p = 0,005) resiste ao limiar de 0,013 para os quatro cenários.
- O acoplamento medido por fan-out **cresceu** com o número de camadas, contrariando a hipótese inicial.
- Aplicação pequena, uma implementação por estruturação, um único hospedeiro.
- O cenário de modificabilidade (três mudanças aplicadas às três versões) está no repositório (`data/bruto/mudancas`), mas ficou **fora** do REX por limite de páginas.
