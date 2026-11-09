"""
Gera o resumo expandido (REX) do 21º CONTECSI no layout do template de graduação.

Os números das tabelas vêm de data/tratado/*.csv (analisar_resultados.py), nunca digitados à mão.

Uso:
    python publicacao/tarefa09-contecsi/manuscrito/gerar_manuscrito.py
Saída (nesta pasta): template_artigo_2024_comparativo_arquitetural.docx e a versão _sem-autores.docx
"""
import csv
import json
import re
import sys
import tempfile
from pathlib import Path

import pymupdf
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[2]
TRATADO = RAIZ / "data" / "tratado"
FIGURAS = TRATADO / "figuras"
FONT = "Arial"
C, J, L = WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.JUSTIFY, WD_ALIGN_PARAGRAPH.LEFT
NOME_BASE = "template_artigo_2024_comparativo_arquitetural"
REPO = "github.com/victorgeroto/iniciacao-cientifica-engenharia-de-software"

ARQS = ["monolito", "camadas", "clean"]
SIGLA = {"monolito": "A", "camadas": "B", "clean": "C"}


# ------------------------------------------------------------------ dados

def ler_csv(nome):
    with open(TRATADO / nome, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def carregar():
    d = {"resumo": ler_csv("desempenho_resumo.csv"), "testes": ler_csv("desempenho_testes.csv"),
         "codigo": ler_csv("codigo_metricas.csv"), "infra": ler_csv("codigo_dependencia_infra.csv"),
         "mudancas": ler_csv("mudancas_impacto.csv"), "vertical": ler_csv("escala_vertical_speedup.csv"),
         "meta": json.loads((RAIZ / "data" / "bruto" / "experimento" / "metadados.json").read_text(encoding="utf-8"))}
    d["idx"] = {(r["fase"], r["condicao"], r["metrica"], r["arquitetura"]): r for r in d["resumo"]}
    return d


def media(d, fase, cond, metrica, arq):
    return float(d["idx"][(fase, cond, metrica, arq)]["media"])


def dp(d, fase, cond, metrica, arq):
    return float(d["idx"][(fase, cond, metrica, arq)]["dp"])


def teste(d, fase, cond, metrica):
    """Teste global (Kruskal-Wallis) e pares, para uma métrica em uma condição."""
    linhas = [t for t in d["testes"] if (t["fase"], t["condicao"], t["metrica"]) == (fase, cond, metrica)]
    if not linhas:
        return None
    return {"p": float(linhas[0]["kw_p"]), "eps": float(linhas[0]["epsilon2"]),
            "pares": {t["par"]: (float(t["p_holm"]), float(t["cliff_delta"])) for t in linhas}}


def br(x, casas=1):
    return f"{x:,.{casas}f}".replace(",", "X").replace(".", ",").replace("X", ".")


def pval(p):
    return "< 0,001" if p < 0.001 else br(p, 3)


# ------------------------------------------------------------------ documento

def novo_documento(sem_autores):
    doc = Document()
    sec = doc.sections[0]
    sec.page_width, sec.page_height = Cm(21.0), Cm(29.7)
    sec.top_margin, sec.left_margin = Cm(3), Cm(3)
    sec.bottom_margin, sec.right_margin = Cm(2), Cm(2)
    sec.header_distance = Cm(0.8)
    st = doc.styles["Normal"]
    st.font.name, st.font.size = FONT, Pt(12)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    st.paragraph_format.space_before = st.paragraph_format.space_after = Pt(0)
    cp = doc.core_properties
    cp.author = cp.last_modified_by = cp.title = cp.comments = cp.subject = cp.keywords = cp.category = ""
    return doc, sec


class Escritor:
    def __init__(self, doc):
        self.doc = doc

    def runs(self, p, text, size=None, bold=None, italic=None):
        for part in re.split(r"(\*\*.+?\*\*|\*.+?\*)", text):
            if not part:
                continue
            if part.startswith("**"):
                r, bd, it = p.add_run(part[2:-2]), True, None
            elif part.startswith("*"):
                r, bd, it = p.add_run(part[1:-1]), None, True
            else:
                r, bd, it = p.add_run(part), None, None
            r.font.name = FONT
            if size:
                r.font.size = Pt(size)
            r.bold = bd or bold
            r.italic = it or italic
        return p

    def para(self, text="", align=J, size=None, spacing=1.5, indent=True, bold=None, italic=None,
             before=0, after=0, keep_next=False):
        p = self.doc.add_paragraph()
        p.alignment = align
        pf = p.paragraph_format
        pf.line_spacing, pf.space_before, pf.space_after = spacing, Pt(before), Pt(after)
        pf.keep_with_next = keep_next
        if indent:
            pf.first_line_indent = Cm(1.25)
        self.runs(p, text, size, bold, italic)
        return p

    def h1(self, t):
        return self.para(t, align=L, indent=False, bold=True, before=12, after=12, keep_next=True)

    def h2(self, t):
        return self.para(t, align=L, indent=False, before=6, after=6, keep_next=True)

    def legenda(self, texto):
        return self.para(texto, align=C, indent=False, size=10, spacing=1.0, before=6, after=3, keep_next=True)

    def fonte(self, texto="Elaborado pelos autores (2026)."):
        return self.para(f"**Fonte:** {texto}", align=C, indent=False, size=10, spacing=1.0, before=3, after=6)

    def figura(self, caminho, largura_cm):
        p = self.doc.add_paragraph()
        p.alignment = C
        p.paragraph_format.keep_with_next = True
        p.add_run().add_picture(str(caminho), width=Cm(largura_cm))

    def tabela(self, linhas, larguras, tam=9, alinhar_esq=(0,)):
        """Tabela nativa do Word: só linhas horizontais (topo, sob o cabeçalho e base), como pede o template."""
        t = self.doc.add_table(rows=len(linhas), cols=len(linhas[0]))
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        t.autofit = False
        for j, w in enumerate(larguras):
            t.columns[j].width = Cm(w)
        for i, linha in enumerate(linhas):
            for j, txt in enumerate(linha):
                cel = t.cell(i, j)
                cel.width = Cm(larguras[j])
                p = cel.paragraphs[0]
                p.alignment = L if j in alinhar_esq else C
                p.paragraph_format.line_spacing = 1.0
                r = p.add_run(str(txt))
                r.font.name, r.font.size, r.bold = FONT, Pt(tam), (i == 0)
                pr = cel._tc.get_or_add_tcPr()
                b = OxmlElement("w:tcBorders")
                for borda in ("top", "left", "bottom", "right"):
                    el = OxmlElement(f"w:{borda}")
                    on = (borda == "top" and i in (0, 1)) or (borda == "bottom" and i in (0, len(linhas) - 1))
                    el.set(qn("w:val"), "single" if on else "nil")
                    if on:
                        el.set(qn("w:sz"), "6")
                        el.set(qn("w:color"), "000000")
                    b.append(el)
                pr.append(b)
        return t


def cabecalho(doc, sec, esc):
    """Cabeçalho do template de graduação com os dados do 21º CONTECSI (site do evento, 08/11/2026)."""
    hdr = sec.header
    hdr.is_linked_to_previous = False
    p0 = hdr.paragraphs[0]
    tb = hdr.add_table(rows=1, cols=3, width=Cm(16))
    tb.alignment = WD_TABLE_ALIGNMENT.CENTER
    tb.autofit = False
    for j, w in enumerate((3.0, 10.0, 3.0)):
        tb.columns[j].width = Cm(w)
        tb.cell(0, j).width = Cm(w)
    tb.cell(0, 0).paragraphs[0].add_run().add_picture(str(AQUI / "assets" / "logo_tecsi.png"), height=Cm(1.9))
    tb.cell(0, 2).paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    tb.cell(0, 2).paragraphs[0].add_run().add_picture(str(AQUI / "assets" / "logo_contecsi.png"), height=Cm(1.9))
    mid = tb.cell(0, 1)
    linhas = (("21º CONTECSI – 01 a 04 de dezembro de 2026", 10, True),
              ("International Conference on Information Systems and Technology Management", 8, None),
              ("Resumo Expandido", 8, True),
              ("TECSI FEA USP – São Paulo/SP · Presencial (01/12) e Virtual (02 a 04/12)", 8, None))
    for i, (txt, sz, bd) in enumerate(linhas):
        q = mid.paragraphs[0] if i == 0 else mid.add_paragraph()
        q.alignment = C
        esc.runs(q, txt, size=sz, bold=bd)
    p0._p.getparent().remove(p0._p)
    hp = hdr.add_paragraph()
    hp.alignment = C
    hp.paragraph_format.space_before, hp.paragraph_format.space_after = Pt(3), Pt(8)
    esc.runs(hp, "MODALIDADE RESUMO EXPANDIDO (REX) – GRADUAÇÃO", size=9, bold=True)


INST = "Centro Universitário SENAI São Paulo – UNISENAI-SP, Campus Sorocaba/SP"
PH = "[preencher]"


def bloco_autores(doc, esc):
    def autor(cel, nome, primeiro):
        for i, ln in enumerate((nome, f"ORCID: https://orcid.org/{PH}", f"CPF: {PH}", INST, f"e-mail: {PH}")):
            p = cel.paragraphs[0] if (primeiro and i == 0) else cel.add_paragraph()
            p.alignment = C
            p.paragraph_format.line_spacing = 1.0
            if i == 0 and not primeiro:
                p.paragraph_format.space_before = Pt(5)
            esc.runs(p, ln, size=8, italic=True)
    ta = doc.add_table(rows=1, cols=2)
    ta.alignment = WD_TABLE_ALIGNMENT.CENTER
    autor(ta.cell(0, 0), "Victor Hugo Geroto Toledo", True)
    autor(ta.cell(0, 1), "Orientador: Prof. Me. Deivison Shindi Takatu", True)
    autor(ta.cell(0, 1), "Orientador: Prof. Dr. Glauco Todesco", False)
    esc.para("", spacing=1.0, indent=False, after=4)


def renderizar_ambiente(destino):
    """Figura 1: rasteriza o SVG versionado do ambiente experimental real."""
    doc = pymupdf.open(str(RAIZ / "src" / "experimentos" / "figuras" / "ambiente_experimental.svg"))
    doc[0].get_pixmap(dpi=170).save(str(destino))


# ------------------------------------------------------------------ carga tolerante a fases ainda não medidas

def ler_csv_opcional(nome):
    try:
        return ler_csv(nome)
    except FileNotFoundError:
        return []


def carregar():  # noqa: F811  (substitui a versão estrita acima)
    d = {"resumo": ler_csv("desempenho_resumo.csv"), "testes": ler_csv("desempenho_testes.csv"),
         "codigo": ler_csv("codigo_metricas.csv"), "infra": ler_csv("codigo_dependencia_infra.csv"),
         "vertical": ler_csv_opcional("escala_vertical_speedup.csv"),
         "meta": json.loads((RAIZ / "data" / "bruto" / "experimento" / "metadados.json").read_text(encoding="utf-8"))}
    d["idx"] = {(r["fase"], r["condicao"], r["metrica"], r["arquitetura"]): r for r in d["resumo"]}
    return d


def cv(d, fase, cond, metrica, arq):
    return float(d["idx"][(fase, cond, metrica, arq)]["cv_pct"])


CEN = [("list", "Listar"), ("get", "Buscar"), ("create", "Criar"), ("mixed", "Misto")]
METS = ("throughput_rps", "latencia_media_ms", "cpu_por_req_ms")
CARGA = [("c001", 1), ("c010", 10), ("c025", 25), ("c050", 50), ("c100", 100)]
VERT = [("cpu0.5", "0,5"), ("cpu1.0", "1"), ("cpu2.0", "2")]


def fatos(d):
    """Extrai os fatos que o texto afirma e FALHA se os dados os contrariarem."""
    f = {}
    leitura = [c for c, _ in CEN if c != "create"]
    for c in leitura:
        for m in METS:
            t = teste(d, "cenarios", c, m)
            assert t and t["p"] > 0.05, f"o texto afirma 'sem diferença detectável' em {c}/{m}, mas p = {t and t['p']}"
    for m in METS:
        t = teste(d, "cenarios", "create", m)
        assert t and t["p"] < 0.05, f"o texto afirma diferença em 'criar'/{m}, mas p = {t and t['p']}"
    f["p_criar"] = teste(d, "cenarios", "create", "throughput_rps")["p"]
    f["p_leitura_min"] = min(teste(d, "cenarios", c, m)["p"] for c in leitura for m in METS)
    tp = {a: media(d, "cenarios", "create", "throughput_rps", a) for a in ARQS}
    assert tp["monolito"] > tp["camadas"] > tp["clean"], "ordem do throughput em 'criar' mudou"
    f["tp_criar"] = tp
    f["queda_criar_pct"] = 100 * (tp["monolito"] - tp["clean"]) / tp["monolito"]
    f["cv_leitura_max"] = max(cv(d, "cenarios", c, "throughput_rps", a) for c in leitura for a in ARQS)
    f["cv_criar_max"] = max(cv(d, "cenarios", "create", "throughput_rps", a) for a in ARQS)
    cod = {r["arquitetura"]: r for r in d["codigo"]}
    cob = {a: json.loads(cod[a]["cobertura_por_camada"]) for a in ARQS}
    f["cob_negocio"] = {"monolito": cob["monolito"]["raiz"], "camadas": cob["camadas"]["services"],
                        "clean": cob["clean"]["domain"]}
    f["cob_total"] = {a: float(cod[a]["cobertura_total"]) for a in ARQS}
    f["loc"] = {a: int(cod[a]["loc"]) for a in ARQS}
    f["fanout"] = {a: float(cod[a]["fanout_medio"]) for a in ARQS}
    assert f["fanout"]["monolito"] < f["fanout"]["camadas"] < f["fanout"]["clean"], "ordem do fan-out mudou"
    assert f["cob_negocio"]["camadas"] > f["cob_negocio"]["monolito"]
    assert f["cob_negocio"]["clean"] > f["cob_negocio"]["monolito"]
    infra = {r["projeto"].replace("api-", ""): float(r["pct_com_infra"]) for r in d["infra"]}
    assert infra["clean"] == 0 and infra["camadas"] > 0 and infra["monolito"] > 0, "dependência de infra mudou"
    f["infra"] = infra
    f["n"] = int(d["idx"][("cenarios", "list", "throughput_rps", "monolito")]["n"])
    f["escala"] = all(("carga", c, "throughput_rps", "monolito") in d["idx"] for c, _ in CARGA) and \
        all(("vertical", c, "throughput_rps", "monolito") in d["idx"] for c, _ in VERT)
    return f


def pct(x):
    return br(x, 0) + "%"


def textos(d, f):
    ta, tc = f["tp_criar"]["monolito"], f["tp_criar"]["clean"]
    cn, it = f["cob_negocio"], f["infra"]
    resumo = (
        "Este trabalho tem como objetivo comparar, de forma quantitativa, o desempenho e a manutenibilidade de "
        "sistemas de software estruturados em três padrões arquiteturais: Monólito, Arquitetura em Camadas (MVC) e "
        "Clean Architecture. A metodologia consiste em um protótipo tripartido, no qual a mesma aplicação de "
        "gerenciamento de tarefas é desenvolvida três vezes, mantendo constantes o domínio, a linguagem "
        "(TypeScript com Node.js), o banco de dados (PostgreSQL) e a infraestrutura de execução (Docker, em um "
        "único hospedeiro), com carga gerada pelo autocannon e métricas coletadas da mesma forma em cada versão. "
        f"Em quatro cenários, com {f['n']} rodadas cada, não houve diferença detectável de desempenho na leitura e "
        f"no cenário misto; na criação de tarefas, o módulo único alcançou {br(ta, 0)} req/s contra {br(tc, 0)} da "
        f"Clean Architecture (p = {pval(f['p_criar'])}). Na estrutura do código, os mesmos testes cobriram "
        f"{pct(cn['monolito'])} da regra de negócio no módulo único, {pct(cn['camadas'])} em camadas e "
        f"{pct(cn['clean'])} na Clean Architecture, cuja camada de domínio não importa nenhum framework (contra "
        f"{pct(it['camadas'])} em camadas), enquanto o acoplamento medido por fan-out cresceu com o número de "
        "camadas. Os resultados se limitam a uma aplicação pequena em um único hospedeiro.")
    abstract = (
        "This work aims to compare, quantitatively, the performance and maintainability of software systems "
        "structured in three architectural patterns: Monolith, Layered Architecture (MVC) and Clean Architecture. "
        "The methodology is a tripartite prototype, in which the same task management application is developed "
        "three times, keeping the domain, the language (TypeScript with Node.js), the database (PostgreSQL) and "
        "the execution infrastructure (Docker, on a single host) constant, with load generated by autocannon and "
        "metrics collected the same way in every version. In four scenarios, with "
        f"{f['n']} rounds each, no detectable performance difference was found for reads and for the mixed "
        f"scenario; when creating tasks, the single module reached {br(ta, 0)} req/s against {br(tc, 0)} for "
        f"Clean Architecture (p = {pval(f['p_criar'])}). Regarding code structure, the same tests covered "
        f"{pct(cn['monolito'])} of the business logic in the single module, {pct(cn['camadas'])} in layers and "
        f"{pct(cn['clean'])} in Clean Architecture, whose domain layer imports no framework (versus "
        f"{pct(it['camadas'])} in layers), while coupling measured by fan-out grew with the number of layers. "
        "The results are limited to a small application on a single host.")
    assert len(resumo.split()) <= 250 and len(abstract.split()) <= 250, (len(resumo.split()), len(abstract.split()))
    return resumo, abstract


INTRO_1 = (
    "A transformação digital ampliou a demanda sobre a arquitetura dos sistemas de software, que precisam "
    "sustentar grande volume de solicitações simultâneas e disponibilidade constante. A escolha do padrão "
    "arquitetural é uma decisão estratégica, pois afeta a evolução, a manutenção e a escalabilidade do sistema "
    "durante todo o seu ciclo de vida (Garlan; Shaw, 1993). Padrões como a Arquitetura em Camadas, difundida no "
    "modelo MVC (*Model-View-Controller*), e a Clean Architecture (Martin, 2017) favorecem a divisão de "
    "responsabilidades, a testabilidade e a independência de tecnologias externas.")
INTRO_2 = (
    "Escolher o padrão que ofereça o melhor equilíbrio entre facilidade de implementação, manutenibilidade e "
    "escalabilidade em sistemas de médio porte é o problema central desta pesquisa. Essa escolha costuma se "
    "apoiar em preferências pessoais, modismos ou relatos anedóticos (Fowler, 2002), o que gera decisões "
    "subótimas, dívida técnica e custos crescentes de manutenção (Newman, 2015). Blinowski, Ojdowska e "
    "Przybylek (2022) mostraram que, em máquina única, o monólito supera os microsserviços em latência, o que "
    "reforça a necessidade de medição rigorosa. Nas fontes revisadas (Seção 3.2), não foram encontrados estudos "
    "que comparem os três padrões sob as mesmas condições operacionais.")
INTRO_3 = (
    "O objetivo deste trabalho é analisar quantitativamente o desempenho e a manutenibilidade de sistemas "
    "construídos segundo os três padrões, por meio de um protótipo funcional tripartido executado em contêineres "
    "Docker, com métricas coletadas de forma idêntica em cada versão.")

TEORIA_1 = (
    "A arquitetura de software estabelece a organização de um sistema por meio de decisões estruturais e "
    "princípios de projeto. Garlan e Shaw (1993) a definem como o estudo da organização global dos componentes, "
    "de suas interações e dos princípios que governam o projeto e a evolução do sistema; para Bass, Clements e "
    "Kazman (2012), é o conjunto de estruturas necessárias para raciocinar sobre o sistema, seus elementos e as "
    "relações entre eles. O modelo monolítico, que reúne interface, lógica de negócio e persistência em um único "
    "artefato implantável, é historicamente o mais utilizado: proporciona baixa latência em contextos de baixa "
    "complexidade, mas limita o escalonamento seletivo e amplia o acoplamento à medida que o sistema cresce "
    "(Dragoni *et al.*, 2017).")
TEORIA_2 = (
    "A Arquitetura em Camadas, popularizada pelo MVC, reduz o acoplamento por meio da separação horizontal entre "
    "apresentação, lógica de negócio e persistência, melhorando a organização do código e facilitando a "
    "escalabilidade (Tu, 2023). A Clean Architecture (Martin, 2017) isola as regras de negócio no núcleo de "
    "camadas concêntricas e aplica o princípio da inversão de dependências, o que favorece a testabilidade e a "
    "independência tecnológica.")
RELACIONADOS_1 = (
    "A comparação empírica entre padrões arquiteturais é uma linha de investigação estabelecida, porém "
    "concentrada no eixo monólito–microsserviços. O trabalho metodologicamente mais próximo é o de Blinowski, "
    "Ojdowska e Przybylek (2022), que compararam, de forma controlada, uma aplicação monolítica e sua versão em "
    "microsserviços, mantendo constantes a funcionalidade e o ambiente de execução. Em máquina única, a versão "
    "monolítica apresentou menor latência, atribuída à comunicação em processo, enquanto a distribuída foi "
    "superior no escalonamento horizontal sob carga crescente. Esse achado fundamenta a adoção das mesmas "
    "métricas (tempo de resposta, *throughput* e consumo de recursos) neste trabalho. Tapia *et al.* (2020) "
    "seguiram desenho semelhante, com a mesma funcionalidade sob arquiteturas distintas, medida em condições "
    "equivalentes, com foco em consumo de recursos de hardware e latência, procedimento que este trabalho "
    "replica.")
RELACIONADOS_2 = (
    "Revisões sistemáticas recentes reforçam essa leitura: Di Francesco, Lago e Malavolta (2019) mapearam 103 "
    "estudos primários sobre arquitetura de microsserviços e evidenciaram a predominância desse eixo; Abgaz "
    "*et al.* (2023) analisaram 35 estudos sobre decomposição de monólitos e concluíram que o tema permanece em "
    "estágio inicial de maturidade; e Velepucha e Flores (2023) sistematizaram princípios e desafios de "
    "migração. A literatura compara majoritariamente monólitos e microsserviços, sem considerar a Clean "
    "Architecture como alternativa estruturalmente coesa (Richards, 2015). Nenhum dos estudos identificados a "
    "avalia empiricamente em comparação controlada com o monólito e com a Arquitetura em Camadas, sob "
    "identidade funcional, de linguagem e de infraestrutura, lacuna em que se insere este trabalho.")

REFERENCIAS = [
    "ABGAZ, Y. *et al.* Decomposition of monolith applications into microservices architectures: a systematic "
    "review. **IEEE Transactions on Software Engineering**, v. 49, n. 8, p. 4213-4242, 2023. DOI: "
    "10.1109/TSE.2023.3287297.",
    "BASS, L.; CLEMENTS, P.; KAZMAN, R. **Software architecture in practice**. 3. ed. Boston: Addison-Wesley, "
    "2012.",
    "BLINOWSKI, G.; OJDOWSKA, A.; PRZYBYŁEK, A. Monolithic vs. microservice architecture: a performance and "
    "scalability evaluation. **IEEE Access**, v. 10, p. 20357-20374, 2022. DOI: 10.1109/ACCESS.2022.3152803.",
    "DI FRANCESCO, P.; LAGO, P.; MALAVOLTA, I. Architecting with microservices: a systematic mapping study. "
    "**Journal of Systems and Software**, v. 150, p. 77-97, 2019. DOI: 10.1016/j.jss.2019.01.001.",
    "DRAGONI, N. *et al.* Microservices: yesterday, today, and tomorrow. *In*: MAZZARA, M.; MEYER, B. (ed.). "
    "**Present and ulterior software engineering**. Cham: Springer, 2017. p. 195-216.",
    "FOWLER, M. **Patterns of enterprise application architecture**. Boston: Addison-Wesley, 2002.",
    "GARLAN, D.; SHAW, M. An introduction to software architecture. *In*: AMBRIOLA, V.; TORTORA, G. (ed.). "
    "**Advances in software engineering and knowledge engineering**. Singapore: World Scientific Publishing, "
    "1993. p. 1-39.",
    "KRUSKAL, W. H.; WALLIS, W. A. Use of ranks in one-criterion variance analysis. **Journal of the American "
    "Statistical Association**, v. 47, n. 260, p. 583-621, 1952. DOI: 10.1080/01621459.1952.10483441.",
    "MARTIN, R. C. **Clean architecture**: a craftsman's guide to software structure and design. Upper Saddle "
    "River: Prentice Hall, 2017.",
    "NEWMAN, S. **Building microservices**: designing fine-grained systems. Sebastopol: O'Reilly Media, 2015.",
    "RICHARDS, M. **Software architecture patterns**. Sebastopol: O'Reilly Media, 2015.",
    "TAPIA, F. *et al.* From monolithic systems to microservices: a comparative study of performance. **Applied "
    "Sciences**, v. 10, n. 17, art. 5797, 2020. DOI: 10.3390/app10175797.",
    "TU, Z. Research on the application of layered architecture in computer software development. **Journal of "
    "Computing and Electronic Information Management**, v. 11, n. 3, p. 34-38, 2023. DOI: "
    "10.54097/jceim.v11i3.08.",
    "VELEPUCHA, V.; FLORES, P. A survey on microservices architecture: principles, patterns and migration "
    "challenges. **IEEE Access**, v. 11, p. 88339-88358, 2023. DOI: 10.1109/ACCESS.2023.3305687.",
]


# ------------------------------------------------------------------ construção

def tabela_cenarios(d):
    linhas = [["Cenário", "Métrica", "A", "B", "C", "p"]]
    for c, nome in CEN:
        for m, rotulo, casas in (("throughput_rps", "req/s", 0), ("latencia_media_ms", "latência (ms)", 1)):
            vals = [f"{br(media(d, 'cenarios', c, m, a), casas)} ± {br(dp(d, 'cenarios', c, m, a), casas)}"
                    for a in ARQS]
            linhas.append([nome if m == "throughput_rps" else "", rotulo, *vals, pval(teste(d, "cenarios", c, m)["p"])])
    return linhas


def tabela_codigo(d, f):
    cod = {r["arquitetura"]: r for r in d["codigo"]}
    return [["Indicador", "A", "B", "C"],
            ["Arquivos de código", *[cod[a]["arquivos"] for a in ARQS]],
            ["Linhas de código (LOC)", *[str(f["loc"][a]) for a in ARQS]],
            ["Fan-out médio (imports internos por arquivo)", *[br(f["fanout"][a], 2) for a in ARQS]],
            ["Dependências entre camadas", *[cod[a]["dep_entre_camadas"] for a in ARQS]],
            ["Cobertura total de linhas", *[pct(f["cob_total"][a]) for a in ARQS]],
            ["Cobertura da camada de negócio", *[pct(f["cob_negocio"][a]) for a in ARQS]],
            ["Arquivos de negócio que importam frameworks", *[pct(f["infra"][a]) for a in ARQS]]]


def tabela_escala(d):
    linhas = [["Condição", "A", "B", "C", "p"]]
    for c, x in CARGA:
        linhas.append([f"{x} conexões (req/s)",
                       *[br(media(d, "carga", c, "throughput_rps", a), 0) for a in ARQS],
                       pval(teste(d, "carga", c, "throughput_rps")["p"])])
    for c, x in VERT:
        linhas.append([f"{x} vCPU (req/s)", *[br(media(d, "vertical", c, "throughput_rps", a), 0) for a in ARQS],
                       pval(teste(d, "vertical", c, "throughput_rps")["p"])])
    return linhas


def construir(sem_autores, saida):
    d = carregar()
    f = fatos(d)
    resumo, abstract = textos(d, f)
    meta = d["meta"]
    so = "Windows 11" if "Windows-11" in meta["host"]["so"] else meta["host"]["so"]
    doc, sec = novo_documento(sem_autores)
    esc = Escritor(doc)
    cabecalho(doc, sec, esc)
    esc.para("COMPARATIVO ARQUITETURAL: MONÓLITO, ARQUITETURA EM CAMADAS (MVC) E CLEAN ARCHITECTURE EM SISTEMAS "
             "ESCALÁVEIS", align=C, indent=False, bold=True, spacing=1.0, before=6, after=8)
    esc.para("ARCHITECTURAL COMPARISON: MONOLITH, LAYERED ARCHITECTURE (MVC) AND CLEAN ARCHITECTURE IN SCALABLE "
             "SYSTEMS", align=C, indent=False, bold=True, spacing=1.0, after=10)
    if not sem_autores:
        bloco_autores(doc, esc)
    esc.para(f"**RESUMO:** {resumo}", indent=False, spacing=1.0, size=11)
    esc.para("**Palavras-chave:** Arquitetura de Software; Desempenho; Escalabilidade; Manutenibilidade; "
             "Testabilidade.", indent=False, spacing=1.0, size=11, after=8)
    esc.para(f"**ABSTRACT:** {abstract}", indent=False, spacing=1.0, size=11)
    esc.para("**Keywords:** Maintainability; Performance; Scalability; Software Architecture; Testability.",
             indent=False, spacing=1.0, size=11)

    intro = [INTRO_1, INTRO_2, INTRO_3]
    assert sum(len(t.replace("*", "")) for t in intro) <= 2500, "introdução acima de 2.500 caracteres"
    esc.h1("1 INTRODUÇÃO")
    for t in intro:
        esc.para(t)

    esc.h1("2 METODOLOGIA")
    esc.para(
        "A pesquisa adota a implementação de um protótipo tripartido: a mesma aplicação de gerenciamento de "
        "tarefas é desenvolvida três vezes, cada versão seguindo um padrão (A: Monólito, em módulo único; B: "
        "Arquitetura em Camadas/MVC; C: Clean Architecture). Assim, o padrão arquitetural é a variável "
        "independente, enquanto o domínio de negócio, a linguagem (TypeScript com Node.js), o banco de dados "
        "(PostgreSQL) e a infraestrutura de execução (Docker) permanecem constantes. Cada versão contempla API "
        "REST, regras de negócio para tarefas, autenticação por *JSON Web Tokens* (JWT) e persistência em "
        "PostgreSQL, diferindo apenas na organização do código-fonte e na distribuição de responsabilidades. A "
        "equivalência funcional é verificada por um teste que executa o mesmo roteiro HTTP nas três versões e "
        "exige respostas idênticas.")
    esc.para(
        f"Cada versão é executada em um contêiner Docker próprio e tem seu banco PostgreSQL 16 em outro "
        f"contêiner, todos com o mesmo limite de 1 vCPU e 512 MB, em um único hospedeiro ({so}, "
        f"{meta['host']['cpus_logicas']} processadores lógicos, Docker {meta['docker']}), conforme a Figura 1. O "
        "gerador de carga autocannon, no mesmo hospedeiro, executa quatro cenários (listar, buscar, criar e "
        f"misto) com 10 conexões simultâneas, 3 s de aquecimento e 10 s de medição, em {f['n']} rodadas com a "
        "ordem das versões rotacionada a cada rodada. Tempo de resposta e *throughput* são medidos pelo gerador, "
        "e o consumo de CPU por requisição é lido de cada API. Indicadores de qualidade de código, como "
        "cobertura de testes, dependências entre módulos e linhas de código por camada, complementam a análise. "
        "A diferença entre as versões é testada com o teste de Kruskal-Wallis (Kruskal; Wallis, 1952), adequado a "
        f"amostras de tamanho {f['n']} sem suposição de normalidade, com nível de significância de 0,05.")
    esc.legenda("**Figura 1 –** Ambiente experimental e instrumentação da coleta de métricas")
    fig = Path(tempfile.gettempdir()) / "ambiente_experimental.png"
    renderizar_ambiente(fig)
    esc.figura(fig, 15.0)
    esc.fonte()

    esc.h1("3 REFERENCIAL TEÓRICO")
    esc.h2("3.1 PADRÕES ARQUITETURAIS")
    esc.para(TEORIA_1)
    esc.para(TEORIA_2)
    esc.h2("3.2 TRABALHOS RELACIONADOS")
    esc.para(RELACIONADOS_1)
    esc.para(RELACIONADOS_2)

    esc.h1("4 RESULTADOS E DISCUSSÃO")
    ta, tb, tc = (f["tp_criar"][a] for a in ARQS)
    esc.para(
        "A implementação das três versões foi concluída, e os mesmos oito casos de teste de unidade passam em "
        "todas. Os resultados dos cenários de carga estão na Tabela 1 e os indicadores de código na Tabela 2.")
    esc.legenda(f"**Tabela 1 –** Cenários de carga (média ± desvio-padrão, n = {f['n']}; 10 conexões; 1 vCPU) e "
                "valor p de Kruskal-Wallis")
    esc.tabela(tabela_cenarios(d), (2.0, 2.6, 3.1, 3.1, 3.1, 1.6), tam=8.5, alinhar_esq=(0, 1))
    esc.fonte("Elaborado pelos autores (2026). A: módulo único; B: camadas; C: Clean Architecture.")
    esc.para(
        f"Nos cenários de leitura (listar e buscar) e no misto, não houve diferença detectável entre as versões "
        f"(p ≥ {br(f['p_leitura_min'], 2)}), mas o coeficiente de variação do *throughput* chegou a "
        f"{br(f['cv_leitura_max'], 0)}%, o que indica ruído do hospedeiro e limita o poder do teste. A exceção "
        f"foi a criação de tarefas, medida com baixa variação (CV ≤ {br(f['cv_criar_max'], 0)}%): o módulo único "
        f"teve o maior *throughput* ({br(ta, 0)} req/s), seguido de Camadas ({br(tb, 0)}) e Clean Architecture "
        f"({br(tc, 0)}), diferença de {br(f['queda_criar_pct'], 1)}% entre os extremos (p = "
        f"{pval(f['p_criar'])}), com o custo de CPU por requisição na mesma ordem. A hipótese de menor latência do "
        "monólito em baixa carga, derivada de Blinowski, Ojdowska e Przybylek (2022), confirmou-se, portanto, "
        "apenas na escrita e com efeito pequeno.")
    esc.legenda("**Tabela 2 –** Indicadores de qualidade de código das três versões")
    esc.tabela(tabela_codigo(d, f), (7.4, 2.6, 2.6, 2.6), tam=8.5)
    esc.fonte("Elaborado pelos autores (2026). Cobertura dos mesmos oito casos de teste, sem banco de dados.")
    esc.para(
        f"A Clean Architecture tem {br(f['loc']['clean'] / f['loc']['monolito'], 1)} vezes mais linhas que o "
        f"módulo único ({f['loc']['clean']} contra {f['loc']['monolito']}) e o maior fan-out médio "
        f"({br(f['fanout']['clean'], 2)} contra {br(f['fanout']['monolito'], 0)}); a hipótese de menor "
        "acoplamento entre módulos, medido por esse indicador, não se confirmou. Já a independência de "
        f"tecnologias externas, medida pela parcela de arquivos de negócio que importam frameworks ou drivers, foi "
        f"de {pct(f['infra']['monolito'])} no módulo único, {pct(f['infra']['camadas'])} em camadas e "
        f"{pct(f['infra']['clean'])} na Clean Architecture. A testabilidade, medida pela cobertura da camada de "
        f"negócio com os mesmos testes, foi de {pct(f['cob_negocio']['monolito'])}, "
        f"{pct(f['cob_negocio']['camadas'])} e {pct(f['cob_negocio']['clean'])}, respectivamente.")
    if f["escala"]:
        sig = [x for x in [("carga", c) for c, _ in CARGA] + [("vertical", c) for c, _ in VERT]
               if teste(d, x[0], x[1], "throughput_rps")["p"] < 0.05]
        esc.para(
            "A Tabela 3 traz o *throughput* sob carga crescente e com mais CPU. " +
            (f"Houve diferença significativa em {len(sig)} das {len(CARGA) + len(VERT)} condições."
             if sig else f"Não houve diferença significativa em nenhuma das {len(CARGA) + len(VERT)} condições."))
        esc.legenda("**Tabela 3 –** *Throughput* (req/s, média, n = 5) sob carga crescente e escala vertical")
        esc.tabela(tabela_escala(d), (5.0, 2.8, 2.8, 2.8, 1.6), tam=8.5)
        esc.fonte()

    esc.h1("5 CONSIDERAÇÕES FINAIS")
    esc.para(
        "Em relação ao objetivo proposto, as três versões foram implementadas, verificadas como funcionalmente "
        "equivalentes e comparadas. Nas condições medidas, o desempenho foi equivalente na leitura e até "
        f"{br(f['queda_criar_pct'], 1)}% menor na escrita das versões mais estruturadas, enquanto a camada de "
        "negócio de Camadas e da Clean Architecture teve cobertura maior e, na Clean Architecture, nenhuma "
        "dependência de frameworks; o acoplamento entre módulos, por outro lado, cresceu com o número de camadas. "
        "Os resultados têm validade limitada: o gerador de carga e as APIs dividem o mesmo hospedeiro, a "
        f"aplicação é pequena, cada padrão foi implementado uma vez e há apenas {f['n']} rodadas por condição.")
    esc.para(
        "Como trabalhos futuros, propõem-se avaliar a escalabilidade horizontal, repetir o estudo com outras "
        "implementações e aplicações maiores e incluir pipelines de integração e entrega contínua (CI/CD) para "
        "cada versão.")

    esc.h1("REFERÊNCIAS BIBLIOGRÁFICAS")
    for r in REFERENCIAS:
        esc.para(r, align=L, indent=False, spacing=1.0, after=6)
    doc.save(saida)
    return f


def main():
    for sem in (False, True):
        saida = AQUI / (NOME_BASE + ("_sem-autores" if sem else "") + ".docx")
        f = construir(sem, saida)
        print("gerado:", saida.name)
    print("escala incluída:", f["escala"])


if __name__ == "__main__":
    main()
