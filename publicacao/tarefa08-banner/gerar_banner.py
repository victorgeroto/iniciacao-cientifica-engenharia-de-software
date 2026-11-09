"""
Gera o banner científico preliminar (banner-v1.pptx) com gráficos nativos e editáveis.

Todos os números vêm de data/tratado/*.csv, pelas mesmas funções do manuscrito do CONTECSI
(publicacao/tarefa09-contecsi/manuscrito/gerar_manuscrito.py), inclusive as verificações que
fazem a geração falhar se os dados contrariarem uma afirmação do texto.

Formato provisório: A0 retrato (84,1 x 118,9 cm). Não é exigência do III Congresso UniSENAI-SP.

Uso:  python publicacao/tarefa08-banner/gerar_banner.py
"""
import importlib.util
import json
import math
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path

from lxml import etree
from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION, XL_LEGEND_POSITION, XL_MARKER_STYLE
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, MSO_AUTO_SIZE, PP_ALIGN
from pptx.enum.chart import XL_AXIS_CROSSES
from pptx.enum.shapes import MSO_CONNECTOR
from pptx.oxml.ns import qn
from pptx.util import Cm, Emu, Pt

AQUI = Path(__file__).resolve().parent
MANUSCRITO = AQUI.parent / "tarefa09-contecsi" / "manuscrito" / "gerar_manuscrito.py"
spec = importlib.util.spec_from_file_location("gerar_manuscrito", MANUSCRITO)
M = importlib.util.module_from_spec(spec)
spec.loader.exec_module(M)

FONT = "Arial"
NAVY, INK, MUTED, LIGHT = "12263F", "1F2937", "4B5563", "F1F5F9"
COR = {"monolito": "0284C7", "camadas": "D97706", "clean": "7C3AED"}
NOME = {"monolito": "A · Módulo único", "camadas": "B · Camadas (MVC)", "clean": "C · Clean Architecture"}
ARQS = M.ARQS

W, H = 84.1, 118.9
MARG, GAP = 2.5, 2.0
COLW = (W - 2 * MARG - 2 * GAP) / 3
CORPO = 34       # pt
TOPO = 24.0      # cm, início do corpo
FIM_COLUNA = 102.6


def rgb(h):
    return RGBColor.from_string(h)


# ------------------------------------------------------------------ texto

def estima(texto, largura_cm, pt, bullet=False, negrito=False):
    """Altura aproximada (cm) de um parágrafo, para empilhar blocos sem sobreposição."""
    util = (largura_cm - 0.5 - (1.2 if bullet else 0)) * 28.3465
    cpl = max(10, util / (pt * (0.57 if negrito else 0.53)))
    linhas = max(1, math.ceil(len(texto.replace("**", "")) / cpl))
    return linhas * pt * 1.22 / 28.3465


MEDIDAS = {}      # nome da caixa -> altura medida pelo PowerPoint (cm)
_contador = [0]


def runs(p, texto, pt, cor=INK, negrito=False, italico=False):
    partes = texto.split("**")
    for i, parte in enumerate(partes):
        if not parte:
            continue
        r = p.add_run()
        r.text = parte
        r.font.name, r.font.size = FONT, Pt(pt)
        r.font.bold = negrito or (i % 2 == 1)
        r.font.italic = italico
        r.font.color.rgb = rgb(cor)


def marcador(p, recuo_cm=1.2):
    pPr = p._p.get_or_add_pPr()
    pPr.set("marL", str(int(Cm(recuo_cm))))
    pPr.set("indent", str(-int(Cm(recuo_cm))))
    bu = etree.SubElement(pPr, qn("a:buFont"))
    bu.set("typeface", "Arial")
    ch = etree.SubElement(pPr, qn("a:buChar"))
    ch.set("char", "•")


def caixa(slide, x, y, w, paragrafos, pt=CORPO, cor=INK, bullet=False, negrito=False, italico=False,
          alinhar=PP_ALIGN.LEFT, apos=10, altura=None, ancora=MSO_ANCHOR.TOP):
    """Caixa de texto com altura estimada. Devolve a altura usada (cm)."""
    _contador[0] += 1
    nome = f"txt_{_contador[0]}"
    if altura:
        h = altura
    elif nome in MEDIDAS:
        h = MEDIDAS[nome] + 0.3
    else:
        h = sum(estima(t, w, pt, bullet, negrito) + apos / 28.3465 for t in paragrafos) + 0.4
    tb = slide.shapes.add_textbox(Cm(x), Cm(y), Cm(w), Cm(h))
    tb.name = nome
    tf = tb.text_frame
    tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.word_wrap = True
    tf.vertical_anchor = ancora
    tf.margin_left = tf.margin_right = Cm(0.25)
    tf.margin_top = tf.margin_bottom = Cm(0.1)
    for i, t in enumerate(paragrafos):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = alinhar
        p.space_after = Pt(apos)
        p.line_spacing = 1.0
        runs(p, t, pt, cor, negrito, italico)
        if bullet:
            marcador(p)
    return h


def retangulo(slide, x, y, w, h, preenchimento, linha=None):
    s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Cm(x), Cm(y), Cm(w), Cm(h))
    s.fill.solid()
    s.fill.fore_color.rgb = rgb(preenchimento)
    if linha:
        s.line.color.rgb = rgb(linha)
        s.line.width = Pt(2)
    else:
        s.line.fill.background()
    s.shadow.inherit = False
    return s


PS_MEDIR = """
param([string]$Arquivo, [string]$Saida)
$p = New-Object -ComObject PowerPoint.Application
try {
  $pres = $p.Presentations.Open($Arquivo, -1, 0, 0)
  $r = @{}
  foreach ($sh in $pres.Slides(1).Shapes) {
    if ($sh.Name -like 'txt_*' -and $sh.HasTextFrame) { $r[$sh.Name] = [math]::Round($sh.TextFrame.TextRange.BoundHeight / 28.3465, 3) }
  }
  $pres.Close()
  $r | ConvertTo-Json | Set-Content -Path $Saida -Encoding utf8
} finally { $p.Quit() }
"""


def medir(pptx_path):
    """Abre o pptx no PowerPoint e devolve a altura real de cada caixa de texto (cm)."""
    ps1 = Path(tempfile.gettempdir()) / "medir_banner.ps1"
    out = Path(tempfile.gettempdir()) / "medidas_banner.json"
    ps1.write_text(PS_MEDIR, encoding="utf-8")
    out.unlink(missing_ok=True)
    subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(ps1),
                    "-Arquivo", str(pptx_path), "-Saida", str(out)], check=True, capture_output=True)
    return json.loads(out.read_text(encoding="utf-8-sig"))


class Coluna:
    def __init__(self, slide, indice):
        self.slide, self.x, self.y = slide, MARG + indice * (COLW + GAP), TOPO
        self.indice = indice

    def secao(self, titulo):
        retangulo(self.slide, self.x, self.y, COLW, 3.1, NAVY)
        caixa(self.slide, self.x + 0.4, self.y, COLW - 0.8, [titulo], pt=46, cor="FFFFFF", negrito=True,
              apos=0, altura=3.1, ancora=MSO_ANCHOR.MIDDLE)
        self.y += 3.1 + 1.0

    def bullets(self, itens, pt=CORPO):
        self.y += caixa(self.slide, self.x, self.y, COLW, itens, pt=pt, bullet=True, apos=12) + 0.6

    def texto(self, itens, pt=CORPO, **kw):
        self.y += caixa(self.slide, self.x, self.y, COLW, itens, pt=pt, **kw) + 0.4

    def legenda(self, t):
        self.y += caixa(self.slide, self.x, self.y, COLW, [t], pt=24, cor=MUTED, negrito=True, apos=2) + 0.1

    def fonte(self, t="Fonte: elaborado pelos autores (2026)."):
        self.y += caixa(self.slide, self.x, self.y, COLW, [t], pt=22, cor=MUTED, apos=2) + 1.2

    def pular(self, cm):
        self.y += cm

    def conferir(self, nome):
        folga = FIM_COLUNA - self.y
        print(f"  coluna {self.indice + 1} ({nome}): termina em {self.y:5.1f} cm; folga até {FIM_COLUNA:.0f} cm = {folga:5.1f} cm"
              + ("   <<< ESTOURA" if folga < 0 else ""))
        return folga


# ------------------------------------------------------------------ gráficos e tabela

def formatar_eixos(chart, titulo_x=None, titulo_y=None):
    chart.font.size, chart.font.name = Pt(24), FONT
    chart.has_legend = True
    chart.legend.position = XL_LEGEND_POSITION.BOTTOM
    chart.legend.include_in_layout = False
    chart.legend.font.size = Pt(24)
    va, ca = chart.value_axis, chart.category_axis
    va.minimum_scale = 0
    va.has_major_gridlines = True
    va.major_gridlines.format.line.color.rgb = rgb("D1D5DB")
    va.tick_labels.font.size = ca.tick_labels.font.size = Pt(24)
    va.tick_labels.number_format = "#,##0"
    va.tick_labels.number_format_is_linked = False
    va.format.line.color.rgb = ca.format.line.color.rgb = rgb("9CA3AF")
    for eixo, t in ((ca, titulo_x), (va, titulo_y)):
        if t:
            eixo.has_title = True
            eixo.axis_title.text_frame.text = t
            r = eixo.axis_title.text_frame.paragraphs[0].runs[0]
            r.font.size, r.font.bold, r.font.name = Pt(24), False, FONT


def grafico_barras(slide, x, y, w, h, categorias, series):
    cd = CategoryChartData()
    cd.categories = categorias
    for nome, vals in series:
        cd.add_series(nome, vals)
    gf = slide.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, Cm(x), Cm(y), Cm(w), Cm(h), cd)
    ch = gf.chart
    formatar_eixos(ch, None, "req/s")
    ch.category_axis.reverse_order = True               # primeiro cenário no topo
    # Eixo de valores embaixo: o python-pptx não grava esse caso, então ajusta o XML (valAx cruza no máximo).
    ch.value_axis._element.find(qn("c:crosses")).set("val", "max")
    plot = ch.plots[0]
    plot.gap_width, plot.overlap = 45, 0
    plot.has_data_labels = True
    dl = plot.data_labels
    dl.font.size, dl.font.bold = Pt(22), True
    dl.number_format, dl.number_format_is_linked = "#,##0", False
    dl.position = XL_LABEL_POSITION.OUTSIDE_END
    for s, a in zip(plot.series, ARQS):
        s.format.fill.solid()
        s.format.fill.fore_color.rgb = rgb(COR[a])
    return ch


def grafico_linhas(slide, x, y, w, h, categorias, series, titulo_x):
    cd = CategoryChartData()
    cd.categories = categorias
    for nome, vals in series:
        cd.add_series(nome, vals)
    gf = slide.shapes.add_chart(XL_CHART_TYPE.LINE_MARKERS, Cm(x), Cm(y), Cm(w), Cm(h), cd)
    ch = gf.chart
    formatar_eixos(ch, titulo_x, "req/s")
    marcas = (XL_MARKER_STYLE.CIRCLE, XL_MARKER_STYLE.SQUARE, XL_MARKER_STYLE.TRIANGLE)
    for s, a, m in zip(ch.plots[0].series, ARQS, marcas):
        s.smooth = False
        s.format.line.color.rgb = rgb(COR[a])
        s.format.line.width = Pt(5)
        s.marker.style, s.marker.size = m, 16
        s.marker.format.fill.solid()
        s.marker.format.fill.fore_color.rgb = rgb(COR[a])
        s.marker.format.line.color.rgb = rgb(COR[a])
    return ch


def tabela(slide, x, y, w, linhas, larguras, pt=26, alt_linha=1.9):
    gf = slide.shapes.add_table(len(linhas), len(linhas[0]), Cm(x), Cm(y), Cm(w), Cm(alt_linha * len(linhas)))
    t = gf.table
    for j, lw in enumerate(larguras):
        t.columns[j].width = Cm(lw)
    for i, linha in enumerate(linhas):
        t.rows[i].height = Cm(alt_linha)
        for j, txt in enumerate(linha):
            c = t.cell(i, j)
            c.fill.solid()
            c.fill.fore_color.rgb = rgb(NAVY if i == 0 else (LIGHT if i % 2 else "FFFFFF"))
            c.vertical_anchor = MSO_ANCHOR.MIDDLE
            c.margin_left = c.margin_right = Cm(0.25)
            tf = c.text_frame
            tf.word_wrap = True
            p = tf.paragraphs[0]
            p.alignment = PP_ALIGN.LEFT if j == 0 else PP_ALIGN.CENTER
            runs(p, txt, pt, "FFFFFF" if i == 0 else INK, negrito=(i == 0))
    return alt_linha * len(linhas)


def forma(slide, x, y, w, h, fill, linha, linhas, formato=MSO_SHAPE.ROUNDED_RECTANGLE):
    s = slide.shapes.add_shape(formato, Cm(x), Cm(y), Cm(w), Cm(h))
    s.fill.solid()
    s.fill.fore_color.rgb = rgb(fill)
    s.line.color.rgb = rgb(linha)
    s.line.width = Pt(3)
    s.shadow.inherit = False
    tf = s.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = tf.margin_right = Cm(0.2)
    for i, (txt, pt, neg, cor) in enumerate(linhas):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        p.space_after = Pt(2)
        runs(p, txt, pt, cor, negrito=neg)
    return s


def seta(slide, x1, y1, x2, y2):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Cm(x1), Cm(y1), Cm(x2), Cm(y2))
    c.line.color.rgb = rgb("374151")
    c.line.width = Pt(4)
    ln = c.line._get_or_add_ln()
    etree.SubElement(ln, qn("a:tailEnd")).set("type", "triangle")


def diagrama_ambiente(slide, x, y):
    """Figura 1 nativa: benchmark -> três APIs -> um PostgreSQL por API. Devolve a altura (cm)."""
    bh, gap = 4.0, 0.8
    total = 3 * bh + 2 * gap
    forma(slide, x, y + (total - 8.4) / 2, 6.6, 8.4, "FFFFFF", NAVY,
          [("Benchmark", 24, True, NAVY), ("autocannon", 22, False, INK), ("5 rodadas", 22, False, INK),
           ("ordem rotacionada", 20, False, INK)])
    claros = {"monolito": "E0F2FE", "camadas": "FEF3C7", "clean": "EDE9FE"}
    subt = {"monolito": "tudo no mesmo módulo", "camadas": "separação em camadas", "clean": "domínio independente"}
    for i, a in enumerate(ARQS):
        yy = y + i * (bh + gap)
        forma(slide, x + 8.0, yy, 8.6, bh, claros[a], COR[a], [(NOME[a], 24, True, INK), (subt[a], 21, False, INK)])
        forma(slide, x + 18.0, yy, 7.0, bh, "FFFFFF", "6B7280",
              [("PostgreSQL 16", 22, True, INK), ("1 vCPU · 512 MB", 20, False, MUTED)], formato=MSO_SHAPE.CAN)
        yc = yy + bh / 2
        seta(slide, x + 6.6, y + total / 2, x + 8.0, yc)
        seta(slide, x + 16.6, yc, x + 18.0, yc)
    return total


# ------------------------------------------------------------------ construção

def construir(saida):
    _contador[0] = 0
    d = M.carregar()
    f = M.fatos(d)
    br, pval, pct = M.br, M.pval, M.pct
    ta, tb, tc = (f["tp_criar"][a] for a in ARQS)
    sp, rz = f["speedup2"], f["razao100"]

    prs = Presentation()
    prs.slide_width, prs.slide_height = Cm(W), Cm(H)
    cp = prs.core_properties
    cp.author = cp.last_modified_by = cp.comments = cp.subject = cp.keywords = ""
    cp.title = "Banner científico (versão preliminar)"
    cp.created = cp.modified = datetime.now()
    slide = prs.slides.add_slide(prs.slide_layouts[6])

    # ---- cabeçalho
    retangulo(slide, 0, 0, W, 21.5, NAVY)
    retangulo(slide, 0, 21.5, W, 0.7, COR["monolito"])
    caixa(slide, MARG, 2.0, W - 2 * MARG,
          ["Estruturação interna de aplicações monolíticas: comparação entre módulo único, arquitetura em camadas "
           "(MVC) e Clean Architecture"],
          pt=76, cor="FFFFFF", negrito=True, apos=0, altura=10.5)
    caixa(slide, MARG, 12.7, W - 2 * MARG,
          ["Victor Hugo Geroto Toledo (aluno)  ·  Deivison Shindi Takatu (orientador)  ·  Glauco Todesco (orientador)"],
          pt=42, cor="FFFFFF", apos=0, altura=2.6)
    caixa(slide, MARG, 15.7, W - 2 * MARG,
          ["Centro Universitário SENAI São Paulo — UNISENAI-SP · Campus Sorocaba · Análise e Desenvolvimento de Sistemas"],
          pt=34, cor="CBD5E1", apos=0, altura=2.2)
    caixa(slide, MARG, 18.4, W - 2 * MARG,
          ["Iniciação Científica · Engenharia de Software · versão preliminar do banner"],
          pt=30, cor="94A3B8", apos=0, altura=2.0)

    # ---- coluna 1: contexto e método
    c1 = Coluna(slide, 0)
    c1.secao("1  Introdução")
    c1.bullets([
        "**Monólito** é a forma de implantação: um único artefato com um banco de dados.",
        "**Camadas (MVC)** e **Clean Architecture** estruturam o código por dentro. Uma aplicação monolítica pode "
        "adotar qualquer uma delas, ou nenhuma (módulo único).",
        "A literatura compara monólito × microsserviços. Nas fontes revisadas, não há comparação experimental "
        "dessas estruturações internas.",
    ])
    c1.secao("2  Problema e objetivo")
    c1.bullets([
        "**Pergunta:** a estruturação interna de uma mesma aplicação monolítica altera desempenho, escalabilidade "
        "e manutenibilidade?",
        "**Objetivo:** medir as três estruturações em condições idênticas.",
    ])
    c1.secao("3  Metodologia")
    c1.bullets([
        "Mesma API de tarefas, implementada 3 vezes: **A** módulo único · **B** camadas (MVC) · **C** Clean Architecture.",
        "**Constantes:** contrato HTTP, TypeScript/Node 22, PostgreSQL 16, Docker, 1 vCPU e 512 MB.",
        "**autocannon:** 4 cenários (10 conexões), 1 a 100 conexões e 0,5 a 2 vCPU.",
        f"**{f['n']} rodadas** por condição, ordem rotacionada; Kruskal-Wallis com correção de Bonferroni.",
    ])
    c1.legenda("Figura 1 – Ambiente experimental (um hospedeiro, Docker, mesmos limites por serviço)")
    c1.pular(0.4)
    c1.pular(diagrama_ambiente(slide, c1.x, c1.y) + 0.6)
    c1.fonte()
    c1.conferir("contexto e método")

    # ---- coluna 2: resultados de desempenho e escalabilidade
    c2 = Coluna(slide, 1)
    c2.secao("4  Resultados")
    c2.legenda("Figura 2 – Throughput por cenário (média de 5 rodadas; 10 conexões; 1 vCPU)")
    cat = [nome for _, nome in M.CEN]
    grafico_barras(slide, c2.x, c2.y, COLW, 21.0, cat,
                   [(NOME[a], [round(M.media(d, "cenarios", c, "throughput_rps", a)) for c, _ in M.CEN]) for a in ARQS])
    c2.pular(21.3)
    c2.fonte()
    c2.bullets([
        f"**Leitura e misto:** sem diferença detectável (p ≥ {br(f['p_leitura_min'], 2)}).",
        f"**Criar tarefa:** A {br(ta, 0)} > B {br(tb, 0)} > C {br(tc, 0)} req/s, "
        f"queda de {br(f['queda_criar_pct'], 1)}% (p = {pval(f['p_criar'])}, resiste a Bonferroni).",
    ])
    c2.legenda("Figura 3 – Throughput sob carga crescente (1 vCPU)")
    cargas = [x for _, x in M.CARGA]
    grafico_linhas(slide, c2.x, c2.y, COLW, 19.5, [str(x) for x in cargas],
                   [(NOME[a], [round(M.media(d, "carga", c, "throughput_rps", a)) for c, _ in M.CARGA]) for a in ARQS],
                   "Conexões simultâneas")
    c2.pular(19.8)
    c2.fonte()
    c2.bullets([
        f"**Escalabilidade:** {f['esc_sig']} das {f['esc_total']} condições difere ({f['esc_txt']}) e "
        f"{'resiste' if f['esc_sobrevive'] else 'não resiste'} à correção de Bonferroni (limiar {br(f['esc_bonf'], 3)}).",
        f"**Dobrar a CPU (1→2 vCPU):** ×{br(sp['monolito'], 2)} (A), ×{br(sp['camadas'], 2)} (B), "
        f"×{br(sp['clean'], 2)} (C).",
    ])
    c2.conferir("resultados")

    # ---- coluna 3: código, discussão, conclusões
    c3 = Coluna(slide, 2)
    cod = {r["arquitetura"]: r for r in d["codigo"]}
    c3.secao("5  Indicadores de código")
    c3.legenda("Tabela 1 – Indicadores das três versões")
    linhas = [["Indicador", "A", "B", "C"],
              ["Linhas de código", *[str(f["loc"][a]) for a in ARQS]],
              ["Arquivos", *[cod[a]["arquivos"] for a in ARQS]],
              ["Fan-out médio", *[br(f["fanout"][a], 2) for a in ARQS]],
              ["Cobertura da regra de negócio", *[pct(f["cob_negocio"][a]) for a in ARQS]],
              ["Negócio que importa frameworks", *[pct(f["infra"][a]) for a in ARQS]]]
    h = tabela(slide, c3.x, c3.y, COLW, linhas, (11.5, 4.5, 4.5, 4.5), pt=25, alt_linha=2.5)
    c3.pular(h + 0.4)
    c3.fonte("Fonte: elaborado pelos autores (2026). Cobertura dos mesmos 8 testes, sem banco de dados.")
    c3.secao("6  Discussão")
    c3.bullets([
        f"A **Clean Architecture** isola o domínio (**{pct(f['infra']['clean'])}** de dependência de frameworks), mas tem "
        f"**{br(f['loc']['clean'] / f['loc']['monolito'], 1)}×** mais código e o maior fan-out ({br(f['fanout']['clean'], 2)}).",
        "A hipótese de **menor acoplamento** medido por fan-out **não se confirmou**.",
        f"**Testabilidade:** a regra de negócio teve {pct(f['cob_negocio']['monolito'])} (A), "
        f"{pct(f['cob_negocio']['camadas'])} (B) e {pct(f['cob_negocio']['clean'])} (C) de cobertura.",
    ])
    c3.secao("7  Conclusões e limitações")
    c3.bullets([
        f"Sem diferença detectável de desempenho na leitura; escrita até **{br(f['queda_criar_pct'], 1)}% menor** nas "
        "versões mais estruturadas.",
        "Separar a regra de negócio melhora a testabilidade medida, ao custo de mais código.",
        f"**Limites:** mesmo hospedeiro, CV até {br(f['cv_escala_max'], 0)}%, aplicação pequena, uma implementação "
        f"por estrutura, n = {f['n']}; escala horizontal não avaliada.",
    ])
    c3.conferir("código e conclusões")

    # ---- rodapé
    retangulo(slide, 0, 104.4, W, 0.5, COR["monolito"])
    retangulo(slide, 0, 104.9, W, H - 104.9, LIGHT)
    rx, rw = MARG, (W - 2 * MARG - GAP) * 0.62
    caixa(slide, rx, 106.0, rw, ["Referências essenciais"], pt=40, cor=NAVY, negrito=True, apos=0, altura=2.4)
    refs = [
        "FOWLER, M. **Patterns of enterprise application architecture**. Addison-Wesley, 2002.",
        "MARTIN, R. C. **Clean architecture**. Prentice Hall, 2017.",
        "GARLAN, D.; SHAW, M. An introduction to software architecture. World Scientific, 1993.",
        "BLINOWSKI, G.; OJDOWSKA, A.; PRZYBYŁEK, A. Monolithic vs. microservice architecture. "
        "**IEEE Access**, v. 10, p. 20357-20374, 2022.",
        "KRUSKAL, W. H.; WALLIS, W. A. Use of ranks in one-criterion variance analysis. **JASA**, v. 47, 1952.",
    ]
    caixa(slide, rx, 108.6, rw, refs, pt=26, cor=INK, apos=5)
    ax = rx + rw + GAP
    aw = W - MARG - ax
    caixa(slide, ax, 106.0, aw, ["Agradecimentos"], pt=40, cor=NAVY, negrito=True, apos=0, altura=2.4)
    caixa(slide, ax, 108.6, aw,
          ["Aos orientadores Prof. Deivison Shindi Takatu e Prof. Glauco Todesco e ao Centro Universitário SENAI "
           "São Paulo.",
           "Dados, código e protocolo: github.com/victorgeroto/iniciacao-cientifica-engenharia-de-software"],
          pt=26, cor=INK, apos=8)

    prs.save(saida)


def main():
    global MEDIDAS
    provisorio = Path(tempfile.gettempdir()) / "banner_passo1.pptx"
    MEDIDAS = {}
    construir(provisorio)
    try:
        MEDIDAS = medir(provisorio)
        print(f"alturas reais medidas no PowerPoint: {len(MEDIDAS)} caixas")
    except Exception as e:  # sem PowerPoint, usa a estimativa
        print("PowerPoint indisponível, usando estimativa:", e)
    saida = AQUI / "banner-v1.pptx"
    construir(saida)
    print("gerado:", saida.name)


if __name__ == "__main__":
    main()
