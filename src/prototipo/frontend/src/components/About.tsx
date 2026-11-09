import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, FlaskConical, ListTodo, X } from "lucide-react";
import { IconButton } from "./ui";

const KEY = "proto.about.dismissed";

/** Texto único usado no login e na tela inicial, para a descrição nunca divergir. */
export const ABOUT_TEXT =
  "Este software é o instrumento experimental de uma pesquisa de Iniciação Científica em Engenharia de Software. " +
  "A mesma aplicação de gerenciamento de tarefas foi construída três vezes, sempre implantada como monólito, " +
  "variando apenas a organização interna do código: módulo único (Transaction Script), arquitetura em camadas e " +
  "Clean Architecture. Assim é possível medir, em condições idênticas, desempenho, escalabilidade, acoplamento, " +
  "testabilidade e esforço de modificação.";

const STEPS = [
  { to: "/tarefas", icon: ListTodo, title: "1. Use a aplicação", text: "Crie tarefas em cada arquitetura e veja o tempo de cada requisição." },
  { to: "/metricas", icon: Activity, title: "2. Veja as métricas", text: "Compare LOC, acoplamento, cobertura de testes, latência e memória." },
  { to: "/carga", icon: FlaskConical, title: "3. Rode o experimento", text: "Dispare a mesma carga nas três APIs e exporte os resultados em CSV." },
];

function wasDismissed() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** Cartão de boas-vindas no topo da tela inicial; pode ser dispensado. */
export function AboutCard() {
  const [hidden, setHidden] = useState(wasDismissed);
  if (hidden) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* sem armazenamento: apenas esconde nesta sessão */
    }
    setHidden(true);
  };

  return (
    <section aria-labelledby="sobre-titulo" className="card relative mb-6 overflow-hidden p-5 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent">Sobre este software</p>
            <h2 id="sobre-titulo" className="text-xl font-semibold tracking-tight text-balance">
              Três organizações de código, uma aplicação monolítica
            </h2>
          </div>
          <IconButton label="Dispensar a apresentação" onClick={dismiss} className="-mr-2 -mt-2 shrink-0">
            <X className="size-4" />
          </IconButton>
        </div>
        <p className="mt-3 max-w-3xl text-fg-muted text-pretty">{ABOUT_TEXT}</p>

        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {STEPS.map(({ to, icon: Icon, title, text }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex h-full flex-col gap-1.5 rounded-xl border border-border bg-surface-2/50 p-3.5 transition-colors duration-200 hover:border-border-strong hover:bg-surface-2"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="size-4 text-accent" aria-hidden />
                  {title}
                </span>
                <span className="text-xs text-fg-muted">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
