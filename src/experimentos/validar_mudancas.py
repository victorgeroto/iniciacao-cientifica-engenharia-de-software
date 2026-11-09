"""
Valida que cada cenário de mudança (M1-M3) funciona nas três versões.

Para cada patch em data/bruto/mudancas/:
  1. copia o backend para uma pasta temporária e aplica o patch;
  2. constrói as imagens (o build compila o TypeScript e executa os 8 testes de unidade);
  3. sobe bancos e APIs em um projeto Docker separado, com bancos vazios;
  4. executa por HTTP o teste de aceitação da mudança nas três APIs.

Uma mudança só entra na análise de modificabilidade se passar nas três versões.
Resultado em data/bruto/mudancas/validacao.json.

Uso (Docker Desktop aberto, com a stack principal parada):
    python src/experimentos/validar_mudancas.py
"""
import json
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
PROTOTIPO = RAIZ / "src" / "prototipo"
MUDANCAS = RAIZ / "data" / "bruto" / "mudancas"
PORTAS = {"monolito": 3001, "camadas": 3002, "clean": 3003}
PROJETO = "mudanca"


def http(method, url, body=None, token=None):
    data = json.dumps(body).encode() if body is not None else None
    headers = {"content-type": "application/json"}
    if token:
        headers["authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            raw = r.read()
            return r.status, (json.loads(raw) if raw else None)
    except urllib.error.HTTPError as e:
        raw = e.read()
        return e.code, (json.loads(raw) if raw else None)


# ------------------------------------------------------------- aceitação

def novo_usuario(base):
    email = f"m-{time.time_ns()}@teste.local"
    status, corpo = http("POST", f"{base}/auth/register", {"name": "Teste", "email": email, "password": "123456"})
    assert status == 201, f"registro falhou: {status}"
    return email, corpo["token"]


def verifica_m1(base):
    """M1: atributo opcional dueDate (data de vencimento)."""
    _, t = novo_usuario(base)
    s, c = http("POST", f"{base}/tasks", {"title": "Com data", "dueDate": "2026-12-01"}, t)
    assert s == 201 and c["dueDate"] == "2026-12-01", f"criar com dueDate: {s} {c}"
    s, c0 = http("POST", f"{base}/tasks", {"title": "Sem data"}, t)
    assert s == 201 and c0["dueDate"] is None, f"criar sem dueDate: {s} {c0}"
    s, u = http("PUT", f"{base}/tasks/{c['id']}", {"dueDate": "2027-01-15"}, t)
    assert s == 200 and u["dueDate"] == "2027-01-15" and u["title"] == "Com data", f"atualizar: {s} {u}"
    s, _ = http("POST", f"{base}/tasks", {"title": "Data inválida", "dueDate": "amanhã"}, t)
    assert s == 400, f"data inválida deveria ser 400, veio {s}"
    s, lista = http("GET", f"{base}/tasks", None, t)
    assert s == 200 and all("dueDate" in x for x in lista), "listagem sem dueDate"


def verifica_m2(base):
    """M2: no máximo 3 tarefas em andamento por usuário."""
    _, t = novo_usuario(base)
    ids = []
    for i in range(3):
        s, c = http("POST", f"{base}/tasks", {"title": f"doing {i}", "status": "doing"}, t)
        assert s == 201, f"as 3 primeiras deveriam passar: {s}"
        ids.append(c["id"])
    s, c = http("POST", f"{base}/tasks", {"title": "quarta", "status": "doing"}, t)
    assert s == 409 and "Limite" in c["error"], f"4ª criação deveria ser 409: {s} {c}"
    s, extra = http("POST", f"{base}/tasks", {"title": "todo"}, t)
    assert s == 201, "tarefa 'todo' não deve ser limitada"
    s, c = http("PUT", f"{base}/tasks/{extra['id']}", {"status": "doing"}, t)
    assert s == 409, f"mover a 4ª para doing deveria ser 409: {s}"
    s, _ = http("PUT", f"{base}/tasks/{ids[0]}", {"title": "renomeada"}, t)
    assert s == 200, "editar tarefa já em andamento não deve ser bloqueado"
    s, _ = http("PUT", f"{base}/tasks/{ids[0]}", {"status": "done"}, t)
    assert s == 200
    s, _ = http("PUT", f"{base}/tasks/{extra['id']}", {"status": "doing"}, t)
    assert s == 200, f"após concluir uma, deveria caber outra: {s}"


def verifica_m3(base):
    """M3: troca de bcryptjs por scrypt nativo; o contrato de autenticação não muda."""
    email, _ = novo_usuario(base)
    s, c = http("POST", f"{base}/auth/login", {"email": email, "password": "123456"})
    assert s == 200 and c["token"], f"login: {s}"
    s, _ = http("POST", f"{base}/auth/login", {"email": email, "password": "errada"})
    assert s == 401, f"senha errada deveria ser 401: {s}"
    s, _ = http("POST", f"{base}/auth/register", {"name": "x", "email": email, "password": "123456"})
    assert s == 409, f"e-mail duplicado deveria ser 409: {s}"


VERIFICADORES = {"M1": verifica_m1, "M2": verifica_m2, "M3": verifica_m3}


# ------------------------------------------------------------- orquestração

def sh(cmd, cwd):
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")


def aguardar(limite=120):
    inicio = time.time()
    while time.time() - inicio < limite:
        try:
            if all(http("GET", f"http://localhost:{p}/health")[0] == 200 for p in PORTAS.values()):
                return True
        except Exception:
            pass
        time.sleep(2)
    return False


def validar(m):
    patch = MUDANCAS / f"{m}.patch"
    resultado = {"mudanca": m, "build_e_testes": None, "aceitacao": {}}
    tmp = Path(tempfile.mkdtemp(prefix="mudanca_"))
    try:
        shutil.copytree(PROTOTIPO / "backend", tmp / "backend",
                        ignore=shutil.ignore_patterns("node_modules", "dist", "coverage", "data"))
        compose = (PROTOTIPO / "docker-compose.yml").read_text(encoding="utf-8")
        (tmp / "docker-compose.yml").write_text(compose.replace("prototipo-backend:latest", "mudanca-backend:latest"),
                                                encoding="utf-8")
        r = sh(["git", "apply", "--whitespace=nowarn", str(patch)], tmp / "backend")
        if r.returncode:
            resultado["build_e_testes"] = f"patch não aplicou: {r.stderr.strip()[:300]}"
            return resultado
        servicos = ["db-monolito", "db-camadas", "db-clean", "api-monolito", "api-camadas", "api-clean"]
        r = sh(["docker", "compose", "-p", PROJETO, "up", "-d", "--build", *servicos], tmp)
        if r.returncode:
            resultado["build_e_testes"] = "FALHOU: " + (r.stderr or r.stdout).strip()[-600:]
            return resultado
        resultado["build_e_testes"] = "ok (tsc + 8 testes de unidade por versão)"
        if not aguardar():
            resultado["aceitacao"] = {a: "APIs não ficaram prontas" for a in PORTAS}
            return resultado
        for arq, porta in PORTAS.items():
            try:
                VERIFICADORES[m](f"http://localhost:{porta}")
                resultado["aceitacao"][arq] = "ok"
            except AssertionError as e:
                resultado["aceitacao"][arq] = f"FALHOU: {e}"
        return resultado
    finally:
        sh(["docker", "compose", "-p", PROJETO, "down", "-v"], tmp)
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    todos = []
    for m in ["M1", "M2", "M3"]:
        print(f"Validando {m}...", flush=True)
        r = validar(m)
        todos.append(r)
        print(f"  build/testes: {r['build_e_testes']}")
        for arq, v in r["aceitacao"].items():
            print(f"  {arq:9s}: {v}")
    (MUDANCAS / "validacao.json").write_text(json.dumps(todos, indent=2, ensure_ascii=False), encoding="utf-8")
    falhas = [m["mudanca"] for m in todos if not str(m["build_e_testes"]).startswith("ok")
              or any(v != "ok" for v in m["aceitacao"].values())]
    sys.exit(f"Mudanças com falha: {falhas}" if falhas else 0)


if __name__ == "__main__":
    main()
