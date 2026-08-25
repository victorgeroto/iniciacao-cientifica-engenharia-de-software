# Trechos para incorporação no Documento Técnico-Científico

**Documento de destino:** `docs/artigos/DocumentoEstruturado/Documento Técnico-Científico Final.docx`
**Origem:** Atividade 06 — [tarefa06-publicacao.md](tarefa06-publicacao.md)
**Data:** 20/08/2026

Este arquivo reúne o material da Atividade 06 já redigido no estilo e no nível de formalidade do artigo, pronto para ser inserido no documento `.docx`. Cada bloco indica exatamente onde entra. As citações seguem o padrão autor-data já usado no documento.

> **Importante:** as Partes 1, 4 e 5 da Atividade 06 **não** devem ir para o artigo. A Parte 1 é conteúdo metalinguístico sobre formas de publicação; a Parte 4 são tabelas de veículos, que não pertencem ao corpo de um artigo; a Parte 5 é reflexão em primeira pessoa. Esses conteúdos permanecem apenas no arquivo `tarefa06-publicacao.md`.

---

## Bloco 1 — Nova seção: TRABALHOS RELACIONADOS

**Onde inserir:** como nova seção de primeiro nível, **entre** `PROBLEMA ABORDADO` e `FUNDAMENTAÇÃO TEÓRICA`.

**Por que inserir:** o documento atual cita Blinowski *et al.* (2022) e Tapia *et al.* (2020) dispersos na Introdução e no Problema Abordado, mas não possui uma seção que sistematize a literatura correlata e delimite, por contraste, a contribuição própria. Essa seção é item esperado em qualquer submissão a periódico ou congresso da área, e é o que sustenta formalmente a alegação de lacuna feita na Introdução.

---

### TRABALHOS RELACIONADOS

A comparação empírica entre padrões arquiteturais constitui uma linha de investigação estabelecida na Engenharia de Software, embora concentrada em um recorte específico. A revisão da literatura correlata a esta pesquisa revela que a quase totalidade dos estudos comparativos disponíveis opõe arquiteturas monolíticas a arquiteturas baseadas em microsserviços, tratando os padrões intermediários de organização interna do código — como a Arquitetura em Camadas e a Clean Architecture — como boas práticas de estruturação de monólitos, e não como objetos de avaliação empírica em igualdade de condições.

O trabalho de maior proximidade metodológica com esta pesquisa é o de Blinowski, Ojdowska e Przybylek (2022), publicado na IEEE Access. Os autores conduziram uma avaliação controlada de desempenho e escalabilidade entre uma aplicação monolítica e sua contraparte em microsserviços, mantendo constantes a funcionalidade e o ambiente de execução. O resultado mais relevante para o presente estudo é contraintuitivo: em ambiente de máquina única, a versão monolítica apresentou latência inferior à versão em microsserviços, atribuída à comunicação em processo, enquanto a versão distribuída demonstrou vantagem no escalonamento horizontal sob carga crescente. Esse achado sustenta duas decisões desta pesquisa: a adoção do mesmo conjunto de métricas — tempo de resposta, *throughput* e consumo de memória — e a formulação da hipótese de que a versão monolítica apresentará menor latência em cenários de baixa carga também na comparação com as versões em Camadas e Clean Architecture.

Em direção convergente, Tapia *et al.* (2020) realizaram análise comparativa quantitativa entre sistemas monolíticos e de microsserviços na revista Applied Sciences, medindo consumo de recursos de hardware e latência, e reportaram maior eficiência de recursos na abordagem distribuída, acompanhada de aumento do custo operacional. O procedimento adotado pelos autores — implementar a mesma funcionalidade sob arquiteturas distintas e submeter as versões a medição sob condições equivalentes — é precisamente o desenho experimental replicado neste trabalho. Em perspectiva mais ampla, Di Francesco, Lago e Malavolta (2019) conduziram estudo de mapeamento sistemático sobre arquitetura de microsserviços a partir de 103 trabalhos primários, identificando padrões de projeto, ferramentas e lacunas de pesquisa relativas a atributos de qualidade como escalabilidade e manutenibilidade, e evidenciando a predominância do eixo monólito–microsserviços na produção da área.

Contribuições mais recentes reforçam essa leitura e permitem delimitar a lacuna com precisão. Velepucha e Flores (2023) sistematizaram, também na IEEE Access, os princípios, padrões e desafios de migração associados à arquitetura de microsserviços, consolidando o vocabulário conceitual da subárea. Abgaz *et al.* (2023) examinaram trinta e cinco trabalhos primários sob protocolo de revisão sistemática e concluíram que a decomposição de monólitos em microsserviços permanece em estágio inicial de maturidade, com ausência de métodos que combinem dados estáticos, dinâmicos e evolutivos. Nenhum dos estudos identificados, contudo, avalia empiricamente a Clean Architecture como alternativa estruturalmente coesa em comparação controlada com o monólito e com a Arquitetura em Camadas, sob identidade funcional, de linguagem e de infraestrutura. É nessa lacuna que se insere a contribuição deste trabalho: o protótipo tripartido isola o padrão arquitetural como única variável independente, permitindo que a comparação entre os três modelos se apoie em evidência quantitativa e reproduzível.

---

## Bloco 2 — Parágrafo adicional em CONSIDERAÇÕES FINAIS

**Onde inserir:** em `CONSIDERAÇÕES FINAIS`, **entre** o parágrafo que trata da hipótese central e o parágrafo final de trabalhos futuros.

**Por que inserir:** declarar a estratégia de divulgação é prática usual em projeto de pesquisa em andamento e demonstra conhecimento do meio de publicação da área — objetivo central da Atividade 06.

---

Quanto à divulgação dos resultados, o mapeamento dos veículos de publicação da área indica três destinos pertinentes, escalonados conforme o estágio de maturidade da pesquisa. No âmbito nacional, o Simpósio Brasileiro de Componentes, Arquiteturas e Reutilização de Software (SBCARS), realizado anualmente pela Sociedade Brasileira de Computação no âmbito do Congresso Brasileiro de Software: Teoria e Prática (CBSoft), apresenta aderência temática direta ao objeto deste estudo e admite submissões em língua portuguesa, incluindo a categoria de artigos de dados, adequada à publicação do conjunto de métricas coletadas no protótipo. No âmbito internacional, a IEEE International Conference on Software Architecture (ICSA) constitui o fórum de referência para discussão de atributos de qualidade e táticas arquiteturais, enquanto a ACM/SPEC International Conference on Performance Engineering (ICPE) concentra a discussão metodológica sobre medição e *benchmarking* de desempenho de software, oferecendo parâmetros para a validação do desenho experimental adotado. Como destino final do estudo consolidado, consideram-se periódicos revisados por pares dedicados à Engenharia de Software, entre os quais o Journal of Systems and Software, que exige de todo artigo a apresentação de evidência empírica de sustentação de suas afirmações, requisito compatível com a natureza quantitativa desta pesquisa.

---

## Bloco 3 — Acréscimos à seção REFERÊNCIAS

**Onde inserir:** na seção `REFERÊNCIAS`, em ordem alfabética.

As três entradas abaixo correspondem às obras citadas nos Blocos 1 e 2 que ainda não constam na lista atual do documento. Inserir ABGAZ antes de AWS; DI FRANCESCO entre DRAGONI e FOWLER; VELEPUCHA após TU.

```
ABGAZ, Y. et al. Decomposition of Monolith Applications Into Microservices
Architectures: A Systematic Review. IEEE Transactions on Software Engineering,
v. 49, n. 8, p. 4213-4242, 2023.

DI FRANCESCO, P.; LAGO, P.; MALAVOLTA, I. Architecting with Microservices:
A Systematic Mapping Study. Journal of Systems and Software, v. 150, p. 77-97, 2019.

VELEPUCHA, V.; FLORES, P. A Survey on Microservices Architecture: Principles,
Patterns and Migration Challenges. IEEE Access, v. 11, p. 88339-88358, 2023.
```

**Observação sobre ordem alfabética:** a lista atual do documento inicia por `AWS`. Com o acréscimo de `ABGAZ`, esta passa a ser a primeira entrada.

---

## Bloco 4 — Correções obrigatórias na seção REFERÊNCIAS

Duas referências do documento atual apresentam metadados incorretos, verificados nas fontes primárias durante a Atividade 06. Substituir integralmente.

### Correção 1 — Tapia *et al.* (2020)

**Consta atualmente no documento:**

```
TAPIA, B. et al. A Comparative Analysis of Monolithic and Microservice
Architectures in Cloud-Based Systems. Applied Sciences, v. 10, n. 17, p. 5797, 2020.
```

**Substituir por:**

```
TAPIA, F. et al. From Monolithic Systems to Microservices: A Comparative Study
of Performance. Applied Sciences, v. 10, n. 17, art. 5797, 2020.
DOI: 10.3390/app10175797.
```

O título e a inicial do primeiro autor estavam incorretos. Autoria completa: Freddy Tapia, Miguel Ángel Mora, Walter Fuertes, Hernán Aules, Eduardo Flores e Theofilos Toulkeridis. Verificado em https://www.mdpi.com/2076-3417/10/17/5797.

### Correção 2 — Tu (2023)

**Consta atualmente no documento:**

```
TU, X. MVC Architecture Pattern Analysis and Its Application in Modern Web
Development. Journal of Software Engineering and Applications, v. 16, n. 4,
p. 112-128, 2023.
```

**Substituir por:**

```
TU, Z. Research on the Application of Layered Architecture in Computer Software
Development. Journal of Computing and Electronic Information Management, v. 11,
n. 3, p. 34-38, 2023. DOI: 10.54097/jceim.v11i3.08.
```

Título, periódico, volume, número e páginas estavam incorretos, assim como a inicial do autor (Zhenxing Tu). Verificado em https://drpress.org/ojs/index.php/jceim/article/view/14398.

> Nota: o arquivo [referencias/tarefa04-referencias.md](../referencias/tarefa04-referencias.md) já registra ambas as referências corretamente. A divergência está restrita ao documento `.docx`.

---

## Bloco 5 — Verificações recomendadas, sem alteração de texto proposta

Itens que dependem de decisão ou de informação que não pude verificar. Não estão redigidos como substituição porque exigem confirmação prévia.

**5.1 — Referência IJCSE (2024).** A entrada `IJCSE. DevOps and Containerization Practices in Modern Software Architecture. International Journal of Computer Science and Engineering, v. 12, n. 3, p. 45-58, 2024` usa o nome do periódico como autor e não foi possível localizar o artigo correspondente. Uma referência não verificável é passível de questionamento em revisão por pares. Recomenda-se localizar a autoria e o DOI, ou substituir a referência por outra que sustente a mesma afirmação sobre convergência entre padrões arquiteturais, DevOps e conteinerização.

**5.2 — Nome da instituição.** O documento `.docx` usa "Centro Universitário SENAI São Paulo — UNISENAI-SP Campus Sorocaba"; os arquivos em Markdown do repositório usam "SENAI Gaspar Ricardo Junior". Padronizar pela denominação oficial em todos os documentos do projeto.

**5.3 — Referência [8] de `referenciasArtigos.md`.** A entrada "SOFTWARE Architecture Evolution. ScienceDirect, 2024" está sem autoria e título reais. Pelo identificador do arquivo (`S0164121224002279`), trata-se de artigo do próprio Journal of Systems and Software publicado em 2024. Recomenda-se recuperar os metadados completos — a busca sugere, como candidato a verificar, "Evolution of code technical debt in microservices architectures" (JSS, DOI 10.1016/j.jss.2024.112301), o que precisa ser confirmado antes de qualquer uso.

**5.4 — Entradas duplicadas em `referenciasArtigos.md`.** As referências [9] e [10] compartilham o mesmo DOI (`10.1109/ACCESS.2022.3152803`) e correspondem, portanto, ao mesmo artigo de Blinowski, Ojdowska e Przybylek (2022). Consolidar em uma única entrada.

**5.5 — Atualização de Fowler e Lewis (2014).** A fundamentação teórica utiliza o artigo de Fowler e Lewis (2014) para posicionar os padrões no espectro evolutivo da arquitetura de software. Velepucha e Flores (2023), acrescentado no Bloco 3, cumpre a mesma função com literatura revisada por pares e nove anos mais recente. Avaliar se convém complementar ou substituir a citação naquele ponto do texto.
