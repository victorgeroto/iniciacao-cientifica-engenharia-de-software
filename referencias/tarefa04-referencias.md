# Levantamento Bibliográfico — Atividade 04
**Projeto:** Comparativo Arquitetural: Monólito, Arquitetura em Camadas (MVC) e Clean Architecture em Sistemas Escaláveis  
**Aluno:** Victor Hugo Geroto Toledo  
**Instituição:** SENAI Gaspar Ricardo Junior  
**Data:** 07/05/2026

---

## Referência 01 — Fundamentação

**Classificação:** `Fundamentação`

### Referência ABNT
MARTIN, Robert C. *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Sebastopol: Prentice Hall / O'Reilly Media, 2017.

### Link para Download (PDF)
- PDF direto (GitHub/ICMC-USP): https://github.com/ropalma/ICMC-USP/blob/master/Book%20-%20Clean%20Architecture%20-%20Robert%20Cecil%20Martin.pdf
- PDF alternativo (plefebvre91.github.io): https://plefebvre91.github.io/resources/clean-architecture.pdf
- Google Scholar: https://scholar.google.com/scholar?q=Clean+Architecture+Robert+Martin+2017
- ACM Digital Library: https://dl.acm.org/doi/10.5555/3175742

### Resumo 
Obra de Robert C. Martin que apresenta princípios de desacoplamento, separação de responsabilidades e independência de frameworks. Fundamenta a implementação da API baseada em Clean Architecture utilizada no projeto comparativo.

### Relação com o Projeto
Esta obra fundamenta diretamente a implementação da API C (Clean Architecture) do protótipo tripartido. Os princípios de inversão de dependências e organização em camadas concêntricas (Domain → Use Cases → Infrastructure → Interface Adapters) são implementados na prática e comparados com os demais padrões, permitindo avaliar se a maior complexidade inicial da Clean Architecture se justifica em termos de testabilidade e baixo acoplamento — hipótese central desta pesquisa.

---

## Referência 02 — Trabalho Relacionado

**Classificação:** `Relacionado`

### Referência ABNT
BLINOWSKI, Grzegorz J.; OJDOWSKA, Anna; PRZYBYLEK, Adam. Monolithic vs. Microservice Architecture: A Performance and Scalability Evaluation. *IEEE Access*, v. 10, p. 20357–20374, 2022. DOI: 10.1109/ACCESS.2022.3152803.

### Link para Download (PDF)
- ResearchGate (PDF aberto): https://www.researchgate.net/publication/358721590_Monolithic_vs_Microservice_Architecture_A_Performance_and_Scalability_Evaluation
- Academia.edu: https://www.academia.edu/109808091/Monolithic_vs_Microservice_Architecture_A_Performance_and_Scalability_Evaluation
- Semantic Scholar: https://www.semanticscholar.org/paper/Monolithic-vs.-Microservice-Architecture:-A-and-Blinowski-Ojdowska/31a9d5d7286b24d5d2a99af005dca7a814640aec
- Google Scholar: https://scholar.google.com/scholar?q=Monolithic+vs+Microservice+Architecture+Performance+Scalability+Blinowski+2022
- IEEE Xplore (DOI): https://ieeexplore.ieee.org/document/9717259/

### Resumo 
Estudo empírico da IEEE Access que compara desempenho e escalabilidade entre arquiteturas monolíticas e microsserviços. Os resultados mostram vantagens do monólito em máquina única e melhor escalabilidade horizontal nos microsserviços.

### Relação com o Projeto
Este artigo é o trabalho relacionado mais direto da pesquisa, pois realiza um comparativo empírico controlado entre padrões arquiteturais — exatamente a abordagem metodológica adotada neste projeto. O resultado contraintuitivo (monólito mais rápido em máquina única) será investigado no contexto específico da comparação entre Monólito, Camadas MVC e Clean Architecture, verificando se tal comportamento se replica. A metodologia de coleta de métricas (tempo de resposta, throughput) foi adaptada para o Dashboard Administrativo deste protótipo.

---

## Referência 03 — Trabalho Relacionado

**Classificação:** `Relacionado`

### Referência ABNT
TAPIA, Freddy et al. From Monolithic Systems to Microservices: A Comparative Study of Performance. *Applied Sciences*, v. 10, n. 17, p. 5797, 2020. DOI: 10.3390/app10175797.

### Link para Download (PDF)
- MDPI (PDF aberto — acesso gratuito): https://www.mdpi.com/2076-3417/10/17/5797/pdf
- Academia.edu: https://www.academia.edu/56692030/From_Monolithic_Systems_to_Microservices_A_Comparative_Study_of_Performance
- Google Scholar: https://scholar.google.com/scholar?q=From+Monolithic+Systems+to+Microservices+Comparative+Study+Performance+Tapia+2020
- DOI direto: https://doi.org/10.3390/app10175797

### Resumo 
Pesquisa publicada na Applied Sciences que compara monólitos e microsserviços em métricas de CPU, memória e latência. O estudo demonstra ganhos de escalabilidade em microsserviços, porém com maior overhead operacional.


### Relação com o Projeto
A metodologia de benchmark deste artigo — aplicação da mesma funcionalidade em diferentes arquiteturas com medição de métricas de hardware — é diretamente replicada neste projeto. As métricas de tempo de resposta, throughput e uso de memória coletadas pelo Dashboard Administrativo do protótipo seguem os mesmos indicadores utilizados pelos autores, permitindo comparação dos resultados obtidos com os valores reportados na literatura.

---

## Referência 04 — Arquitetura

**Classificação:** `Arquitetura`

### Referência ABNT
TU, Zhenxing. Research on the Application of Layered Architecture in Computer Software Development. *Journal of Computing and Electronic Information Management*, v. 11, n. 3, p. 34–38, 2023. DOI: 10.54097/jceim.v11i3.08.

### Link para Download (PDF)
- PDF direto (DrPress): https://drpress.org/ojs/index.php/jceim/article/download/14398/14006
- Página do artigo: https://drpress.org/ojs/index.php/jceim/article/view/14398
- Google Scholar: https://scholar.google.com/scholar?q=Research+Application+Layered+Architecture+Computer+Software+Development+Tu+2023

### Resumo 
Artigo que analisa a aplicação da arquitetura em camadas no desenvolvimento de software moderno. Demonstra como a separação em camadas melhora organização, manutenção e reutilização de componentes.


### Relação com o Projeto
Este artigo fornece o embasamento teórico específico para a implementação da **API B (Arquitetura em Camadas / MVC)** do protótipo. Os princípios de separação horizontal — Controller, Service, Repository, Model — descritos no artigo são implementados diretamente no projeto e avaliados comparativamente, permitindo verificar na prática se os benefícios de manutenibilidade reportados pelos autores se manifestam nas métricas coletadas pelo Dashboard.

---

## Referência 05 — Fundamentação

**Classificação:** `Fundamentação`

### Referência ABNT
FOWLER, Martin; LEWIS, James. Microservices: A Definition of this New Architectural Term. *martinfowler.com*, 25 mar. 2014. Disponível em: https://martinfowler.com/articles/microservices.html. Acesso em: 07 mai. 2026.

### Link para Download (PDF)
- Artigo online (acesso gratuito): https://martinfowler.com/articles/microservices.html
- Google Scholar: https://scholar.google.com/scholar?q=Microservices+definition+architectural+term+Fowler+Lewis+2014
- Semantic Scholar: https://www.semanticscholar.org/paper/Microservices-Fowler-Lewis/a0ab4bcf6df11e741c3e0d12c5a58f67d2af5f33

### Resumo 
Artigo de Martin Fowler e James Lewis que define formalmente o conceito de microsserviços e suas principais características arquiteturais. É uma das referências mais relevantes sobre sistemas distribuídos modernos.


### Relação com o Projeto
Embora microsserviços não sejam implementados diretamente neste protótipo, o artigo de Fowler e Lewis é fundamental para posicionar os três padrões investigados no espectro evolutivo da arquitetura de software. A caracterização do monólito como ponto de partida histórico, descrita pelos autores, justifica metodologicamente a escolha da **API A (Monólito)** como baseline de comparação neste projeto.


---

## Resumo por Classificação

| Nº | Autor / Obra | Ano | Classificação |
|----|-------------|-----|--------------|
| 01 | MARTIN, R. C. — *Clean Architecture* | 2017 | Fundamentação |
| 02 | BLINOWSKI et al. — Monolithic vs. Microservice (IEEE Access) | 2022 | Relacionado |
| 03 | TAPIA et al. — From Monolithic to Microservices (MDPI) | 2020 | Relacionado |
| 04 | TU, Z. — Layered Architecture in Software Dev. (JCEIM) | 2023 | Arquitetura |
| 05 | FOWLER, M.; LEWIS, J. — Microservices (martinfowler.com) | 2014 | Fundamentação |

---

## Estratégias de Busca Utilizadas

Pesquisas conduzidas no **Google Scholar**, **IEEE Xplore**, **Semantic Scholar** e **ResearchGate** com as seguintes combinações:

- `"software architecture" comparison scalable systems monolith layers`
- `clean architecture REST API patterns evaluation`
- `monolithic vs microservices performance evaluation 2022 IEEE`
- `layered architecture MVC maintainability software development`
- `software architecture patterns trends 2022 2023 2024`
- `microservices yesterday today tomorrow history evolution`