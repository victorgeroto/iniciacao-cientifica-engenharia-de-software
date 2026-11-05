import { ReactNode, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Activity, BookOpen, ChevronRight, Gauge, ListTodo, LogOut, Menu, X } from "lucide-react";
import { benchApi, session } from "../lib/api";
import { ARCHITECTURES, ArchitectureId } from "../lib/architectures";
import { IconButton, cx } from "./ui";

const NAV = [
  { to: "/tarefas", label: "Tarefas", icon: ListTodo, hint: "Aplicação" },
  { to: "/metricas", label: "Métricas", icon: Activity, hint: "Código e execução" },
  { to: "/carga", label: "Teste de carga", icon: Gauge, hint: "Experimento" },
  { to: "/metodo", label: "Método", icon: BookOpen, hint: "Protocolo" },
];

export function useApiStatus(intervalMs = 10000) {
  const [status, setStatus] = useState<Partial<Record<ArchitectureId, boolean>> | null>(null);
  useEffect(() => {
    let alive = true;
    const tick = () =>
      benchApi
        .architectures()
        .then((list) => alive && setStatus(Object.fromEntries(list.map((a) => [a.id, a.online]))))
        .catch(() => alive && setStatus({ monolito: false, camadas: false, clean: false }));
    tick();
    const t = setInterval(tick, intervalMs);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [intervalMs]);
  return status;
}

export function BrandMark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cx(
          "relative inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface-2",
          size === "lg" ? "size-11" : "size-9",
        )}
      >
        <img src="/favicon.svg" alt="" className={size === "lg" ? "size-7" : "size-6"} />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight">Comparativo Arquitetural</p>
        <p className="text-xs text-fg-muted">Iniciação Científica</p>
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = session.current();
  const status = useApiStatus();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  const online = status ? ARCHITECTURES.filter((a) => status[a.id]).length : null;
  const current = NAV.find((n) => location.pathname.startsWith(n.to));

  const logout = () => {
    session.logout();
    navigate("/login");
  };

  const nav = (
    <nav aria-label="Principal" className="flex flex-col gap-0.5">
      <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-fg-muted/80">Pesquisa</p>
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cx(
              "group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-200",
              isActive ? "bg-white/[0.06] font-medium text-fg" : "text-fg-muted hover:bg-white/[0.04] hover:text-fg",
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                aria-hidden
                className={cx(
                  "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-opacity duration-200",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon className={cx("size-4", isActive ? "text-accent" : "")} aria-hidden />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  const statusPanel = (
    <div className="card p-3">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted/80">Serviços</p>
        <span className="tabular text-xs text-fg-muted">{online === null ? "…" : `${online}/3`}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {ARCHITECTURES.map((a) => {
          const on = status ? Boolean(status[a.id]) : null;
          return (
            <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2">
                <span aria-hidden className="size-2 rounded-sm" style={{ background: a.colorVar }} />
                {a.label}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
                <span
                  aria-hidden
                  className={cx(
                    "size-1.5 rounded-full",
                    on === null ? "bg-fg-muted" : on ? "bg-accent shadow-[0_0_8px_rgb(34_197_94/0.8)]" : "bg-danger",
                  )}
                />
                {on === null ? "verificando" : on ? "online" : "offline"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const userBox = user && (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/60 p-2.5">
      <span
        aria-hidden
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-xs font-bold text-on-accent"
      >
        {initials(user.name)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-fg-muted">{user.email}</p>
      </div>
      <IconButton label="Sair" onClick={logout} className="size-9">
        <LogOut className="size-4" />
      </IconButton>
    </div>
  );

  return (
    <div className="min-h-dvh bg-glow lg:grid lg:grid-cols-[264px_1fr]">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent"
      >
        Pular para o conteúdo
      </a>

      {/* Barra superior (mobile) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/70 px-4 py-2 backdrop-blur-xl lg:hidden">
        <BrandMark />
        <IconButton label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </IconButton>
      </header>
      {open && (
        <div className="sticky top-[61px] z-20 flex flex-col gap-4 border-b border-border bg-bg/95 p-4 backdrop-blur-xl lg:hidden">
          {nav}
          {statusPanel}
          {userBox}
        </div>
      )}

      {/* Barra lateral (desktop) */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-border bg-surface/50 p-4 backdrop-blur-xl lg:flex">
        <div className="px-1 pt-1">
          <BrandMark />
        </div>
        {nav}
        <div className="mt-auto flex flex-col gap-3">
          {statusPanel}
          {userBox}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Barra de contexto (desktop) */}
        <div className="sticky top-0 z-20 hidden items-center justify-between border-b border-border bg-bg/60 px-8 py-3 backdrop-blur-xl lg:flex">
          <nav aria-label="Você está em" className="flex items-center gap-1.5 text-sm text-fg-muted">
            <span>Protótipo</span>
            <ChevronRight className="size-3.5" aria-hidden />
            <span className="font-medium text-fg" aria-current="page">
              {current?.label ?? ""}
            </span>
          </nav>
          <span
            className={cx(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
              online === 3 ? "border-accent/30 bg-accent/10 text-accent" : "border-border-strong text-fg-muted",
            )}
          >
            <span aria-hidden className={cx("size-1.5 rounded-full", online === 3 ? "bg-accent" : "bg-warning")} />
            {online === null ? "Verificando APIs" : `${online} de 3 APIs online`}
          </span>
        </div>

        <main id="conteudo" className="mx-auto w-full max-w-6xl animate-fade-up px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-fg-muted text-pretty">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
