"""
Executa o protocolo experimental completo no protótipo tripartido.

Fases (todas com aquecimento, medição de duração fixa, N rodadas e ordem das
arquiteturas rotacionada a cada rodada — ver backend/bench/src/loadtest.ts):

  1. cenarios  — listar, buscar, criar e misto, com 10 conexões e 1 vCPU por API;
  2. carga     — listar com 1, 10, 25, 50 e 100 conexões (escalabilidade de carga);
  3. vertical  — listar com 25 conexões e 0,5, 1 e 2 vCPU por API (escala vertical).

Cada execução é gravada em data/bruto/experimento/<fase>__<condicao>.json, junto
com os metadados do ambiente, para permitir auditoria e reprocessamento.

Uso (na raiz do repositório, com Docker Desktop aberto):
    python src/experimentos/executar_experimento.py            # protocolo completo
    python src/experimentos/executar_experimento.py --rapido   # 1 rodada, 3 s (teste do roteiro)
    python src/experimentos/executar_experimento.py --retomar  # continua após interrupção
"""
import argparse
import json
import os
import platform
import subprocess
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
PROTOTIPO = RAIZ / "src" / "prototipo"
SAIDA = RAIZ / "data" / "bruto" / "experimento"
BENCH = "http://localhost:3000"
APIS = ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003"]


def http(method, url, body=None, timeout=30):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={"content-type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
        return json.loads(raw) if raw else None


def compose(*args, cpus="1.0"):
    env = {**os.environ, "API_CPUS": cpus}
    subprocess.run(["docker", "compose", *args], cwd=PROTOTIPO, env=env, check=True)


def aguardar_servicos(limite=180):
    inicio = time.time()
    while time.time() - inicio < limite:
        try:
            if all(http("GET", f"{u}/health", timeout=3)["status"] == "ok" for u in [BENCH, *APIS]):
                return
        except Exception:
            pass
        time.sleep(2)
    sys.exit("Serviços não ficaram prontos a tempo.")


def executar(fase, condicao, params, cpus):
    destino = SAIDA / f"{fase}__{condicao}.json"
    if destino.exists():
        print(f"  [{fase}] {condicao}: já medida, pulando", flush=True)
        return
    run = http("POST", f"{BENCH}/loadtests", params)
    print(f"  [{fase}] {condicao}: execução {run['id']} ({run['progress']['total']} medições)", flush=True)
    while True:
        time.sleep(3)
        run = http("GET", f"{BENCH}/loadtests/{run['id']}")
        if run["status"] != "running":
            break
    if run["status"] != "done":
        sys.exit(f"Execução falhou: {run.get('error')}")
    run["fase"], run["condicao"], run["apiCpus"] = fase, condicao, float(cpus)
    destino.write_text(json.dumps(run, indent=2, ensure_ascii=False), encoding="utf-8")
    erros = sum(r["errors"] + r["non2xx"] for r in run["results"])
    print(f"      concluída · erros/não-2xx: {erros}", flush=True)


def metadados(args):
    git = subprocess.run(["git", "rev-parse", "HEAD"], cwd=RAIZ, capture_output=True, text=True).stdout.strip()
    docker = subprocess.run(["docker", "version", "--format", "{{.Server.Version}}"], capture_output=True, text=True).stdout.strip()
    return {
        "inicio": datetime.now(timezone.utc).isoformat(),
        "commit": git,
        "host": {"so": platform.platform(), "cpus_logicas": os.cpu_count(), "python": platform.python_version()},
        "docker": docker,
        "protocolo": vars(args),
        "limites_por_api": {"memoria": "512 MB", "cpus": "1.0 (fases 1 e 2); 0.5/1/2 (fase 3)"},
        "limites_por_banco": {"memoria": "512 MB", "cpus": "1.0"},
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--rodadas", type=int, default=5)
    ap.add_argument("--duracao", type=int, default=10)
    ap.add_argument("--aquecimento", type=int, default=3)
    ap.add_argument("--rapido", action="store_true", help="1 rodada de 3 s, só para validar o roteiro")
    ap.add_argument("--fases", default="cenarios,carga,vertical")
    ap.add_argument("--retomar", action="store_true", help="mantém os bancos e pula condições já medidas")
    args = ap.parse_args()
    if args.rapido:
        args.rodadas, args.duracao, args.aquecimento = 1, 3, 1

    SAIDA.mkdir(parents=True, exist_ok=True)
    base = {"warmupSeconds": args.aquecimento, "durationSeconds": args.duracao, "rounds": args.rodadas, "seedTasks": 20}
    fases = args.fases.split(",")

    if args.retomar:
        print("Retomando: mantendo bancos e condições já medidas...", flush=True)
        compose("up", "-d", "--build")
    else:
        print("Reiniciando o ambiente com bancos vazios...", flush=True)
        for f in SAIDA.glob("*.json"):
            f.unlink()
        compose("down", "-v")
        compose("up", "-d", "--build")
    aguardar_servicos()
    meta_arq = SAIDA / "metadados.json"
    meta = json.loads(meta_arq.read_text(encoding="utf-8")) if args.retomar and meta_arq.exists() else metadados(args)
    meta.setdefault("retomadas", [])
    if args.retomar:
        meta["retomadas"].append(datetime.now(timezone.utc).isoformat())
    meta_arq.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
    meta["metricas_de_codigo"] = http("GET", f"{BENCH}/code?refresh=1")

    if "cenarios" in fases:
        for cenario in ["list", "get", "create", "mixed"]:
            executar("cenarios", cenario, {**base, "scenario": cenario, "connections": 10}, "1.0")

    if "carga" in fases:
        for conexoes in [1, 10, 25, 50, 100]:
            executar("carga", f"c{conexoes:03d}", {**base, "scenario": "list", "connections": conexoes}, "1.0")

    if "vertical" in fases:
        for cpus in ["0.5", "1.0", "2.0"]:
            print(f"Recriando as APIs com {cpus} vCPU...", flush=True)
            compose("up", "-d", "--force-recreate", "api-monolito", "api-camadas", "api-clean", cpus=cpus)
            aguardar_servicos()
            executar("vertical", f"cpu{cpus}", {**base, "scenario": "list", "connections": 25}, cpus)
        compose("up", "-d", "--force-recreate", "api-monolito", "api-camadas", "api-clean", cpus="1.0")

    meta["fim"] = datetime.now(timezone.utc).isoformat()
    meta_arq.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Experimento concluído. Dados em", SAIDA)


if __name__ == "__main__":
    main()
