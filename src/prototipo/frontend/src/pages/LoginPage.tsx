import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Database, Eye, EyeOff, GitCompareArrows, ShieldCheck } from "lucide-react";
import { ABOUT_TEXT } from "../components/About";
import { BrandMark } from "../components/Layout";
import { Alert, ArchBadge, Button, Input, cx } from "../components/ui";
import { ARCHITECTURES } from "../lib/architectures";
import { session, SessionResult } from "../lib/api";

const FEATURES = [
  { icon: GitCompareArrows, title: "Mesma aplicação, 3 organizações", text: "Só a organização interna do código varia." },
  { icon: Database, title: "Bancos isolados", text: "Um PostgreSQL por API, mesmos recursos." },
  { icon: ShieldCheck, title: "Equivalência verificada", text: "O mesmo roteiro HTTP precisa dar as mesmas respostas." },
];

/** Painel visual decorativo: barras com a proporção de LOC medida nas três versões. */
function ArchitecturePreview() {
  const rows = [
    { id: "monolito", width: "36%", note: "1 arquivo" },
    { id: "camadas", width: "63%", note: "7 camadas" },
    { id: "clean", width: "100%", note: "domínio isolado" },
  ];
  return (
    <div className="card w-full max-w-md p-5 shadow-2xl shadow-black/40" aria-hidden>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Linhas de código por versão</p>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] text-accent">medido</span>
      </div>
      <ul className="flex flex-col gap-4">
        {rows.map((r) => {
          const a = ARCHITECTURES.find((x) => x.id === r.id)!;
          return (
            <li key={r.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <ArchBadge id={r.id} />
                <span className="text-xs text-fg-muted">{r.note}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-2">
                <div className="h-2 rounded-full" style={{ width: r.width, background: a.colorVar }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e: Record<string, string> = {};
    if (mode === "register" && !form.name.trim()) e.name = "Informe seu nome.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Informe um e-mail válido.";
    if (form.password.length < 6) e.password = "A senha precisa ter pelo menos 6 caracteres.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setResult(null);
    const r =
      mode === "login"
        ? await session.login(form.email, form.password)
        : await session.register(form.name, form.email, form.password);
    setLoading(false);
    setResult(r);
    if (r.user && Object.keys(r.failures).length === 0) navigate("/tarefas");
  }

  function switchMode(m: "login" | "register") {
    setMode(m);
    setErrors({});
    setResult(null);
  }

  const failed = result ? Object.entries(result.failures) : [];

  return (
    <div className="grid min-h-dvh bg-bg lg:grid-cols-[1.1fr_1fr]">
      {/* Painel visual (desktop) */}
      <aside className="relative hidden overflow-hidden border-r border-border bg-glow lg:flex lg:flex-col lg:justify-between lg:gap-8 lg:p-10 xl:p-14">
        <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative">
          <BrandMark size="lg" />
        </div>

        <div className="relative flex flex-col gap-8">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/70 px-3 py-1 text-xs text-fg-muted backdrop-blur">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              Protótipo tripartido · Engenharia de Software
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Três organizações de código.
              <br />
              <span className="text-gradient">Um monólito. Mesmas condições.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-fg-muted text-pretty">{ABOUT_TEXT}</p>
          </div>
          <ArchitecturePreview />
        </div>

        <ul className="relative grid grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex flex-col gap-2">
              <Icon className="size-5 text-accent" aria-hidden />
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-fg-muted">{text}</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Formulário */}
      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8 lg:hidden">
            <BrandMark />
          </div>

          <p className="mb-6 rounded-xl border border-border bg-surface p-3.5 text-sm text-fg-muted text-pretty lg:hidden">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-accent">Sobre este software</span>
            {ABOUT_TEXT}
          </p>

          <h2 className="text-2xl font-semibold tracking-tight">
            {mode === "login" ? "Entrar no painel" : "Criar sua conta"}
          </h2>
          <p className="mt-1.5 text-sm text-fg-muted">
            {mode === "login"
              ? "Use a mesma conta nas três APIs. Cada uma tem o próprio banco."
              : "A conta é criada nas três APIs ao mesmo tempo, com as mesmas credenciais."}
          </p>

          <div role="tablist" aria-label="Acesso" className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                className={cx(
                  "min-h-10 rounded-lg text-sm font-medium transition-colors duration-200",
                  mode === m ? "bg-surface-2 text-fg shadow-sm" : "text-fg-muted hover:text-fg",
                )}
              >
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4">
            {mode === "register" && (
              <Input label="Nome" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
            )}
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={form.password}
                onChange={set("password")}
                error={errors.password}
                hint={mode === "register" ? "Mínimo de 6 caracteres." : undefined}
                className="[&_input]:pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
                className="absolute right-1 top-[30px] inline-flex size-10 items-center justify-center rounded-md text-fg-muted transition-colors duration-200 hover:text-fg"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {failed.length > 0 && (
              <Alert tone={result?.user ? "warning" : "danger"}>
                <p className="mb-1 font-medium">
                  {result?.user ? "Acesso parcial — algumas APIs falharam:" : "Não foi possível acessar:"}
                </p>
                <ul className="flex flex-col gap-1">
                  {failed.map(([id, msg]) => (
                    <li key={id} className="flex flex-wrap items-center gap-2">
                      <ArchBadge id={id} size="sm" /> <span>{msg}</span>
                    </li>
                  ))}
                </ul>
                {result?.user && (
                  <Button variant="secondary" className="mt-3 w-full" onClick={() => navigate("/tarefas")} type="button">
                    Continuar mesmo assim
                  </Button>
                )}
              </Alert>
            )}

            <Button type="submit" loading={loading} className="mt-2 w-full">
              {mode === "login" ? "Entrar" : "Criar conta"}
              {!loading && <ArrowRight className="size-4" aria-hidden />}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-fg-muted">acesso simultâneo a</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {ARCHITECTURES.map((a) => (
              <li key={a.id}>
                <ArchBadge id={a.id} size="sm" />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
