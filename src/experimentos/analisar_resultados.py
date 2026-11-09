"""
Análise estatística dos dados do experimento e da análise de impacto de mudança.

Entradas:  data/bruto/experimento/*.json   (executar_experimento.py)
           data/bruto/mudancas/*.numstat   (cenários de mudança M1–M3)
Saídas:    data/tratado/*.csv e data/tratado/figuras/*.png

Procedimentos (amostras pequenas, sem suposição de normalidade):
  - descritiva: média, desvio-padrão amostral, IC 95% (t de Student) e mediana;
  - teste global entre as três organizações: Kruskal-Wallis (com correção de empates),
    p-valor pela qui-quadrado com 2 g.l. (exp(-H/2)) e tamanho de efeito epsilon²;
  - comparações par a par: Mann-Whitney com p-valor exato por permutação,
    ajuste de Holm e delta de Cliff (magnitude segundo Romano et al., 2006).

Uso: python src/experimentos/analisar_resultados.py
"""
import csv
import itertools
import json
import math
import re
from collections import defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
BRUTO = RAIZ / "data" / "bruto"
TRATADO = RAIZ / "data" / "tratado"
FIG = TRATADO / "figuras"
BACKEND = RAIZ / "src" / "prototipo" / "backend"

ARQS = ["monolito", "camadas", "clean"]
NOMES = {"monolito": "Módulo único", "camadas": "Camadas", "clean": "Clean Architecture"}
CORES = {"monolito": "#0284c7", "camadas": "#d97706", "clean": "#7c3aed"}
MARCADORES = {"monolito": "o", "camadas": "s", "clean": "^"}

# t crítico bicaudal (alfa = 0,05) por graus de liberdade
T95 = {1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262,
       10: 2.228, 12: 2.179, 15: 2.131, 20: 2.086, 30: 2.042}


def t95(df):
    if df in T95:
        return T95[df]
    menores = [k for k in T95 if k <= df]
    return T95[max(menores)] if menores else 1.96


# ---------------------------------------------------------------- estatística

def descritiva(xs):
    n = len(xs)
    m = sum(xs) / n
    sd = math.sqrt(sum((x - m) ** 2 for x in xs) / (n - 1)) if n > 1 else 0.0
    h = t95(n - 1) * sd / math.sqrt(n) if n > 1 else 0.0
    s = sorted(xs)
    med = s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2
    return {"n": n, "media": m, "dp": sd, "ic95_inf": m - h, "ic95_sup": m + h, "mediana": med,
            "cv_pct": (sd / m * 100) if m else 0.0}


def postos(valores):
    """Postos médios (midranks) para empates."""
    ordem = sorted(range(len(valores)), key=lambda i: valores[i])
    r = [0.0] * len(valores)
    i = 0
    while i < len(ordem):
        j = i
        while j + 1 < len(ordem) and valores[ordem[j + 1]] == valores[ordem[i]]:
            j += 1
        for k in range(i, j + 1):
            r[ordem[k]] = (i + j) / 2 + 1
        i = j + 1
    return r


def kruskal_wallis(grupos):
    todos = [x for g in grupos for x in g]
    n = len(todos)
    r = postos(todos)
    h, pos = 0.0, 0
    for g in grupos:
        soma = sum(r[pos:pos + len(g)])
        h += soma ** 2 / len(g)
        pos += len(g)
    h = 12 / (n * (n + 1)) * h - 3 * (n + 1)
    # correção de empates
    contagem = defaultdict(int)
    for x in todos:
        contagem[x] += 1
    c = 1 - sum(t ** 3 - t for t in contagem.values()) / (n ** 3 - n)
    h = h / c if c > 0 else 0.0
    gl = len(grupos) - 1
    p = math.exp(-h / 2) if gl == 2 else float("nan")  # sobrevivência exata da qui-quadrado com 2 g.l.
    return h, p, h / (n - 1)


def mann_whitney_exato(x, y):
    """U de Mann-Whitney e p bicaudal exato por permutação (enumeração completa)."""
    todos = x + y
    r = postos(todos)
    n1 = len(x)
    soma_obs = sum(r[:n1])
    media = n1 * (len(todos) + 1) / 2
    dev_obs = abs(soma_obs - media)
    extremos = total = 0
    for comb in itertools.combinations(range(len(todos)), n1):
        total += 1
        if abs(sum(r[i] for i in comb) - media) >= dev_obs - 1e-9:
            extremos += 1
    u = soma_obs - n1 * (n1 + 1) / 2
    return u, extremos / total


def cliff_delta(x, y):
    maior = sum(1 for a in x for b in y if a > b)
    menor = sum(1 for a in x for b in y if a < b)
    d = (maior - menor) / (len(x) * len(y))
    ad = abs(d)
    mag = "desprezível" if ad < 0.147 else "pequeno" if ad < 0.33 else "médio" if ad < 0.474 else "grande"
    return d, mag


def holm(pvalores):
    ordem = sorted(range(len(pvalores)), key=lambda i: pvalores[i])
    ajustados = [0.0] * len(pvalores)
    acumulado = 0.0
    for pos, i in enumerate(ordem):
        acumulado = max(acumulado, min(1.0, pvalores[i] * (len(pvalores) - pos)))
        ajustados[i] = acumulado
    return ajustados


# ---------------------------------------------------------------- desempenho

METRICAS = {
    "throughput_rps": ("Throughput (req/s)", lambda r: r["requestsPerSecond"]),
    "latencia_media_ms": ("Latência média (ms)", lambda r: r["latencyMs"]["mean"]),
    "latencia_p99_ms": ("Latência p99 (ms)", lambda r: r["latencyMs"]["p99"]),
    "cpu_por_req_ms": ("CPU do servidor por requisição (ms)",
                       lambda r: r["server"]["cpuMs"] / r["requests"] if r.get("server") and r["requests"] else None),
    "memoria_rss_mb": ("Memória RSS ao fim da medição (MB)", lambda r: r["server"]["rssMb"] if r.get("server") else None),
}


def carregar_execucoes():
    execs = []
    for f in sorted((BRUTO / "experimento").glob("*__*.json")):
        execs.append(json.loads(f.read_text(encoding="utf-8")))
    return execs


def amostras(execucao, metrica):
    fn = METRICAS[metrica][1]
    out = {a: [] for a in ARQS}
    for r in execucao["results"]:
        v = fn(r)
        if v is not None:
            out[r["architecture"]].append(float(v))
    return out


def analisar_desempenho(execs):
    resumo, testes = [], []
    for ex in execs:
        for metrica in METRICAS:
            am = amostras(ex, metrica)
            for a in ARQS:
                if am[a]:
                    resumo.append({"fase": ex["fase"], "condicao": ex["condicao"], "metrica": metrica, "arquitetura": a,
                                   **{k: round(v, 4) for k, v in descritiva(am[a]).items()}})
            if all(len(am[a]) >= 2 for a in ARQS):
                h, p, eps = kruskal_wallis([am[a] for a in ARQS])
                pares = list(itertools.combinations(ARQS, 2))
                brutos = [mann_whitney_exato(am[x], am[y]) for x, y in pares]
                ajust = holm([b[1] for b in brutos])
                for (x, y), (u, pb), pa in zip(pares, brutos, ajust):
                    d, mag = cliff_delta(am[x], am[y])
                    testes.append({"fase": ex["fase"], "condicao": ex["condicao"], "metrica": metrica,
                                   "kw_H": round(h, 4), "kw_p": round(p, 5), "epsilon2": round(eps, 4),
                                   "par": f"{x} x {y}", "U": u, "p_exato": round(pb, 5), "p_holm": round(pa, 5),
                                   "cliff_delta": round(d, 3), "magnitude": mag})
    return resumo, testes


# ---------------------------------------------------------------- código

INFRA = {"express", "pg", "bcryptjs", "jsonwebtoken"}
CAMADA_NEGOCIO = {"api-monolito": "", "api-camadas": "services", "api-clean": "domain"}


def dependencia_de_infraestrutura():
    """Arquivos da camada de regra de negócio que importam frameworks ou drivers."""
    linhas = []
    for proj, camada in CAMADA_NEGOCIO.items():
        base = BACKEND / proj / "src" / camada
        arquivos = [p for p in base.rglob("*.ts")] if camada else [BACKEND / proj / "src" / "server.ts"]
        com_infra, pacotes = 0, set()
        for p in arquivos:
            src = p.read_text(encoding="utf-8")
            usados = {m.split("/")[0] for m in re.findall(r'from\s+["\']([^."\'][^"\']*)["\']', src)} & INFRA
            if usados:
                com_infra += 1
                pacotes |= usados
        linhas.append({"projeto": proj, "camada_negocio": camada or "(arquivo único)", "arquivos": len(arquivos),
                       "arquivos_com_infra": com_infra,
                       "pct_com_infra": round(100 * com_infra / len(arquivos), 1) if arquivos else 0,
                       "pacotes_infra": " ".join(sorted(pacotes))})
    return linhas


# ---------------------------------------------------------------- mudanças

PROJ_ARQ = {"api-monolito": "monolito", "api-camadas": "camadas", "api-clean": "clean"}


def analisar_mudancas():
    linhas = []
    for f in sorted((BRUTO / "mudancas").glob("M*.numstat")):
        por = {a: {"src_arquivos": 0, "teste_arquivos": 0, "src_linhas_add": 0, "src_linhas_rem": 0,
                   "camadas": set()} for a in ARQS}
        for linha in f.read_text(encoding="utf-8").splitlines():
            if not linha.strip():
                continue
            add, rem, caminho = linha.split("\t")
            proj = caminho.split("/")[0]
            if proj not in PROJ_ARQ:
                continue
            a = PROJ_ARQ[proj]
            partes = caminho.split("/")
            if partes[1] == "test":
                por[a]["teste_arquivos"] += 1
                continue
            por[a]["src_arquivos"] += 1
            por[a]["src_linhas_add"] += int(add)
            por[a]["src_linhas_rem"] += int(rem)
            por[a]["camadas"].add(partes[2] if len(partes) > 3 else "raiz")
        for a in ARQS:
            d = por[a]
            linhas.append({"mudanca": f.stem, "arquitetura": a, "arquivos_codigo": d["src_arquivos"],
                           "arquivos_teste": d["teste_arquivos"],
                           "linhas_alteradas": d["src_linhas_add"] + d["src_linhas_rem"],
                           "camadas_tocadas": len(d["camadas"]), "lista_camadas": " ".join(sorted(d["camadas"]))})
    return linhas


# ---------------------------------------------------------------- figuras

def figuras(resumo, mudancas):
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except ImportError:
        print("matplotlib ausente: figuras não geradas")
        return
    FIG.mkdir(parents=True, exist_ok=True)
    plt.rcParams.update({"font.size": 10, "axes.spines.top": False, "axes.spines.right": False, "figure.dpi": 150})
    idx = {(r["fase"], r["condicao"], r["metrica"], r["arquitetura"]): r for r in resumo}

    def barras(fase, condicoes, rotulos, metrica, arquivo, titulo):
        fig, ax = plt.subplots(figsize=(7, 3.4))
        w = 0.26
        for i, a in enumerate(ARQS):
            xs = [k + (i - 1) * w for k in range(len(condicoes))]
            ys = [idx[(fase, c, metrica, a)]["media"] for c in condicoes]
            err = [idx[(fase, c, metrica, a)]["media"] - idx[(fase, c, metrica, a)]["ic95_inf"] for c in condicoes]
            ax.bar(xs, ys, w, yerr=err, capsize=3, color=CORES[a], label=NOMES[a],
                   hatch=["", "//", ".."][i], edgecolor="white", linewidth=0.5)
        ax.set_xticks(range(len(condicoes)), rotulos)
        ax.set_ylabel(METRICAS[metrica][0])
        ax.set_title(titulo, fontsize=10)
        ax.legend(frameon=False, fontsize=8, ncol=3, loc="upper center", bbox_to_anchor=(0.5, -0.14))
        fig.tight_layout()
        fig.savefig(FIG / arquivo)
        plt.close(fig)

    def linhas(fase, condicoes, xs, metrica, arquivo, xlabel, titulo, logx=False):
        fig, ax = plt.subplots(figsize=(7, 3.4))
        for a in ARQS:
            ys = [idx[(fase, c, metrica, a)]["media"] for c in condicoes]
            lo = [idx[(fase, c, metrica, a)]["ic95_inf"] for c in condicoes]
            hi = [idx[(fase, c, metrica, a)]["ic95_sup"] for c in condicoes]
            ax.plot(xs, ys, marker=MARCADORES[a], color=CORES[a], label=NOMES[a])
            ax.fill_between(xs, lo, hi, color=CORES[a], alpha=0.15, linewidth=0)
        if logx:
            ax.set_xscale("log")
            ax.set_xticks(xs, [str(x) for x in xs])
        ax.set_xlabel(xlabel)
        ax.set_ylabel(METRICAS[metrica][0])
        ax.set_title(titulo, fontsize=10)
        ax.legend(frameon=False, fontsize=8)
        fig.tight_layout()
        fig.savefig(FIG / arquivo)
        plt.close(fig)

    cen = ["list", "get", "create", "mixed"]
    rot = ["Listar", "Buscar", "Criar", "Misto"]
    if all(("cenarios", c, "throughput_rps", "monolito") in idx for c in cen):
        barras("cenarios", cen, rot, "throughput_rps", "cenarios_throughput.png", "Throughput por cenário (10 conexões, 1 vCPU)")
        barras("cenarios", cen, rot, "latencia_media_ms", "cenarios_latencia.png", "Latência média por cenário (10 conexões, 1 vCPU)")
        barras("cenarios", cen, rot, "cpu_por_req_ms", "cenarios_cpu.png", "CPU do servidor por requisição")
    carga = ["c001", "c010", "c025", "c050", "c100"]
    if all(("carga", c, "throughput_rps", "monolito") in idx for c in carga):
        conns = [1, 10, 25, 50, 100]
        linhas("carga", carga, conns, "throughput_rps", "carga_throughput.png", "Conexões simultâneas", "Escalabilidade de carga: throughput", True)
        linhas("carga", carga, conns, "latencia_p99_ms", "carga_latencia_p99.png", "Conexões simultâneas", "Escalabilidade de carga: latência p99", True)
    vert = ["cpu0.5", "cpu1.0", "cpu2.0"]
    if all(("vertical", c, "throughput_rps", "monolito") in idx for c in vert):
        linhas("vertical", vert, [0.5, 1.0, 2.0], "throughput_rps", "vertical_throughput.png", "vCPU por API", "Escalabilidade vertical: throughput")

    if mudancas:
        ms = sorted({m["mudanca"] for m in mudancas})
        fig, ax = plt.subplots(figsize=(7, 3.2))
        w = 0.26
        for i, a in enumerate(ARQS):
            ys = [next(m["arquivos_codigo"] for m in mudancas if m["mudanca"] == k and m["arquitetura"] == a) for k in ms]
            xs = [k + (i - 1) * w for k in range(len(ms))]
            b = ax.bar(xs, ys, w, color=CORES[a], label=NOMES[a], hatch=["", "//", ".."][i], edgecolor="white", linewidth=0.5)
            ax.bar_label(b, fontsize=8)
        ax.set_xticks(range(len(ms)), ["M1 novo atributo", "M2 nova regra", "M3 troca de tecnologia"])
        ax.set_ylabel("Arquivos de código alterados")
        ax.legend(frameon=False, fontsize=8, ncol=3, loc="upper center", bbox_to_anchor=(0.5, -0.14))
        fig.tight_layout()
        fig.savefig(FIG / "mudancas_arquivos.png")
        plt.close(fig)



# ---------------------------------------------------------------- speedup e figuras do manuscrito

def speedup_vertical(resumo):
    """Speedup do throughput em relação a 1 vCPU e eficiência de escala (speedup / razão de CPU)."""
    idx = {(r["condicao"], r["metrica"], r["arquitetura"]): r for r in resumo if r["fase"] == "vertical"}
    linhas = []
    for a in ARQS:
        base = idx.get(("cpu1.0", "throughput_rps", a))
        if not base:
            continue
        for cond, cpus in (("cpu0.5", 0.5), ("cpu1.0", 1.0), ("cpu2.0", 2.0)):
            r = idx.get((cond, "throughput_rps", a))
            if r:
                sp = r["media"] / base["media"]
                linhas.append({"arquitetura": a, "vcpu": cpus, "throughput_rps": round(r["media"], 1),
                               "speedup_vs_1vcpu": round(sp, 3), "eficiencia_de_escala": round(sp / cpus, 3)})
    return linhas


def figuras_manuscrito(resumo):
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except ImportError:
        return
    FIG.mkdir(parents=True, exist_ok=True)
    plt.rcParams.update({"font.size": 8, "axes.spines.top": False, "axes.spines.right": False, "figure.dpi": 300})
    idx = {(r["fase"], r["condicao"], r["metrica"], r["arquitetura"]): r for r in resumo}

    def serie(ax, fase, conds, xs, metrica, ylabel, xlabel, logx=False, titulo=""):
        for a in ARQS:
            pts = [(x, idx[(fase, c, metrica, a)]) for x, c in zip(xs, conds) if (fase, c, metrica, a) in idx]
            if not pts:
                continue
            ax.errorbar([p[0] for p in pts], [p[1]["media"] for p in pts],
                        yerr=[p[1]["media"] - p[1]["ic95_inf"] for p in pts], marker=MARCADORES[a], ms=4,
                        lw=1.2, capsize=2, color=CORES[a], label=NOMES[a])
        if logx:
            ax.set_xscale("log")
            ax.set_xticks(xs, [str(x) for x in xs])
        ax.set_xlabel(xlabel)
        ax.set_ylabel(ylabel)
        ax.set_title(titulo, fontsize=8)

    carga = ["c001", "c010", "c025", "c050", "c100"]
    conns = [1, 10, 25, 50, 100]
    fig, axs = plt.subplots(1, 3, figsize=(6.3, 2.2))
    serie(axs[0], "carga", carga, conns, "throughput_rps", "req/s", "conexões", True, "(a) throughput × carga")
    serie(axs[1], "carga", carga, conns, "latencia_p99_ms", "p99 (ms)", "conexões", True, "(b) latência p99 × carga")
    serie(axs[2], "vertical", ["cpu0.5", "cpu1.0", "cpu2.0"], [0.5, 1.0, 2.0], "throughput_rps", "req/s", "vCPU por API",
          False, "(c) escala vertical")
    axs[2].set_xticks([0.5, 1.0, 2.0])
    axs[0].legend(frameon=False, fontsize=6.5)
    fig.tight_layout()
    fig.savefig(FIG / "fig_escalabilidade.png")
    plt.close(fig)

    cen = ["list", "get", "create", "mixed"]
    rot = ["listar", "buscar", "criar", "misto"]
    fig, axs = plt.subplots(1, 2, figsize=(6.3, 2.2))
    for ax, metrica, yl, tit in ((axs[0], "throughput_rps", "req/s", "(a) throughput"),
                                 (axs[1], "cpu_por_req_ms", "ms de CPU por requisição", "(b) custo de CPU")):
        w = 0.26
        for i, a in enumerate(ARQS):
            ys, err = [], []
            for c in cen:
                r = idx.get(("cenarios", c, metrica, a))
                ys.append(r["media"] if r else 0)
                err.append(r["media"] - r["ic95_inf"] if r else 0)
            ax.bar([k + (i - 1) * w for k in range(4)], ys, w, yerr=err, capsize=2, color=CORES[a], label=NOMES[a],
                   hatch=["", "//", ".."][i], edgecolor="white", linewidth=0.4)
        ax.set_xticks(range(4), rot)
        ax.set_ylabel(yl)
        ax.set_title(tit, fontsize=8)
    axs[0].legend(frameon=False, fontsize=6.5)
    fig.tight_layout()
    fig.savefig(FIG / "fig_cenarios.png")
    plt.close(fig)


def gravar(nome, linhas):
    if not linhas:
        return
    TRATADO.mkdir(parents=True, exist_ok=True)
    with open(TRATADO / nome, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(linhas[0].keys()))
        w.writeheader()
        w.writerows(linhas)
    print(f"  {nome}: {len(linhas)} linhas")


def main():
    execs = carregar_execucoes()
    resumo, testes = analisar_desempenho(execs)
    mudancas = analisar_mudancas()
    gravar("desempenho_resumo.csv", resumo)
    gravar("desempenho_testes.csv", testes)
    gravar("codigo_dependencia_infra.csv", dependencia_de_infraestrutura())
    meta = BRUTO / "experimento" / "metadados.json"
    cod = None
    if meta.exists():
        cod = json.loads(meta.read_text(encoding="utf-8")).get("metricas_de_codigo")
    arq_cod = BRUTO / "experimento" / "codigo_metricas.json"  # alternativa: instantâneo do serviço de benchmark
    if cod is None and arq_cod.exists():
        cod = json.loads(arq_cod.read_text(encoding="utf-8"))
    if cod:
        gravar("codigo_metricas.csv", [{
            "arquitetura": c["id"], "arquivos": c["metrics"]["files"], "loc": c["metrics"]["loc"],
            "fanout_medio": c["metrics"]["avgFanOut"], "fanout_max": c["metrics"]["maxFanOut"],
            "dep_entre_camadas": c["metrics"]["crossLayerDependencies"], "loc_teste": c["metrics"]["tests"]["loc"],
            "cobertura_total": (c["metrics"]["coverage"] or {}).get("lines"),
            "cobertura_por_camada": json.dumps(c["metrics"]["coverageByLayer"], ensure_ascii=False),
        } for c in cod])
    gravar("mudancas_impacto.csv", mudancas)
    gravar("escala_vertical_speedup.csv", speedup_vertical(resumo))
    figuras(resumo, mudancas)
    figuras_manuscrito(resumo)


if __name__ == "__main__":
    main()
