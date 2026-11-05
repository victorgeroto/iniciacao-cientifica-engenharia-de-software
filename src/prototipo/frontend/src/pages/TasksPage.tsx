import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Circle, ClipboardList, ListChecks, Plus, Timer, Trash2, Zap } from "lucide-react";
import { AboutCard } from "../components/About";
import { ArchitectureSelector } from "../components/ArchitectureSelector";
import { PageHeader, useApiStatus } from "../components/Layout";
import { Alert, ArchBadge, Button, Card, EmptyState, IconButton, Input, Kpi, Select, Skeleton, cx } from "../components/ui";
import { errorMessage, onRequest, RequestLogEntry, session, tasksApi } from "../lib/api";
import { ARCHITECTURES, ArchitectureId, archById } from "../lib/architectures";
import type { Task, TaskPriority, TaskStatus } from "../lib/types";

const STATUS: Array<{ id: TaskStatus; label: string; icon: typeof Circle }> = [
  { id: "todo", label: "A fazer", icon: Circle },
  { id: "doing", label: "Em andamento", icon: Timer },
  { id: "done", label: "Concluídas", icon: CheckCircle2 },
];
const PRIORITY: Record<TaskPriority, { label: string; className: string }> = {
  low: { label: "Baixa", className: "text-fg-muted border-border-strong" },
  medium: { label: "Média", className: "text-sky-300 border-sky-400/40" },
  high: { label: "Alta", className: "text-red-300 border-red-400/40" },
};

const emptyForm = { title: "", description: "", status: "todo" as TaskStatus, priority: "medium" as TaskPriority };

export function TasksPage() {
  const [params, setParams] = useSearchParams();
  const arch = (ARCHITECTURES.find((a) => a.id === params.get("arq"))?.id ?? "monolito") as ArchitectureId;
  const status = useApiStatus();
  const api = tasksApi(arch);

  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [titleError, setTitleError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [log, setLog] = useState<RequestLogEntry[]>([]);

  useEffect(() => onRequest((e) => setLog((l) => [e, ...l].slice(0, 12))), []);

  const load = useCallback(async () => {
    setTasks(null);
    setError(null);
    try {
      setTasks(await tasksApi(arch).list());
    } catch (err) {
      setError(errorMessage(err));
      setTasks([]);
    }
  }, [arch]);

  useEffect(() => {
    load();
  }, [load]);

  async function create(ev: FormEvent) {
    ev.preventDefault();
    if (!form.title.trim()) {
      setTitleError("Dê um título para a tarefa.");
      return;
    }
    setTitleError(undefined);
    setSaving(true);
    try {
      const t = await api.create(form);
      setTasks((ts) => [t, ...(ts ?? [])]);
      setForm(emptyForm);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function move(task: Task, next: TaskStatus) {
    const prev = tasks;
    setTasks((ts) => ts?.map((t) => (t.id === task.id ? { ...t, status: next } : t)) ?? null);
    try {
      const updated = await api.update(task.id, { status: next });
      setTasks((ts) => ts?.map((t) => (t.id === task.id ? updated : t)) ?? null);
    } catch (err) {
      setTasks(prev);
      setError(errorMessage(err));
    }
  }

  async function remove(task: Task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return;
    try {
      await api.remove(task.id);
      setTasks((ts) => ts?.filter((t) => t.id !== task.id) ?? null);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const noToken = !session.hasToken(arch);
  const archLog = log.filter((e) => e.architecture === arch && e.status > 0);

  return (
    <>
      <AboutCard />

      <PageHeader
        eyebrow="Aplicação"
        title="Tarefas"
        description="A mesma aplicação nas três arquiteturas. Troque a arquitetura ativa e compare o tempo de cada requisição."
      />

      <div className="mb-6">
        <ArchitectureSelector value={arch} onChange={(id) => setParams({ arq: id })} online={status ?? undefined} />
        <p className="mt-2 text-sm text-fg-muted">{archById(arch).summary}</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Tarefas" value={tasks?.length ?? "—"} hint={`em ${archById(arch).label}`} icon={<ListChecks className="size-4" />} />
        <Kpi
          label="Em andamento"
          value={tasks ? tasks.filter((t) => t.status === "doing").length : "—"}
          icon={<Timer className="size-4" />}
        />
        <Kpi
          label="Concluídas"
          value={tasks?.length ? `${Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100)}%` : "—"}
          icon={<CheckCircle2 className="size-4" />}
        />
        <Kpi
          label="Latência média"
          tone="accent"
          value={archLog.length ? `${(archLog.reduce((s, e) => s + e.ms, 0) / archLog.length).toFixed(1)} ms` : "—"}
          hint={archLog.length ? `${archLog.length} req. vistas pelo navegador` : "faça uma requisição"}
          icon={<Zap className="size-4" />}
        />
      </div>

      {noToken && (
        <div className="mb-4">
          <Alert tone="warning">
            Você não está autenticado na API {archById(arch).label}. Saia e entre novamente para acessar as três.
          </Alert>
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card title="Nova tarefa">
            <form onSubmit={create} noValidate className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Título"
                className="sm:col-span-2"
                maxLength={120}
                value={form.title}
                error={titleError}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input
                label="Descrição"
                className="sm:col-span-2"
                maxLength={1000}
                value={form.description}
                hint="Opcional."
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
                {STATUS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Prioridade"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
              >
                {(Object.keys(PRIORITY) as TaskPriority[]).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY[p].label}
                  </option>
                ))}
              </Select>
              <div className="sm:col-span-2">
                <Button type="submit" loading={saving}>
                  <Plus className="size-4" aria-hidden /> Adicionar em {archById(arch).label}
                </Button>
              </div>
            </form>
          </Card>

          {tasks === null ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : tasks.length === 0 && !error ? (
            <EmptyState icon={<ClipboardList className="size-8" />} title="Nenhuma tarefa nesta arquitetura">
              Cada API tem seu próprio banco: as tarefas criadas no Monólito não aparecem na Clean Architecture.
            </EmptyState>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {STATUS.map((col) => {
                const items = tasks.filter((t) => t.status === col.id);
                return (
                  <section key={col.id} aria-labelledby={`col-${col.id}`} className="flex flex-col gap-3">
                    <h2 id={`col-${col.id}`} className="flex items-center gap-2 text-sm font-semibold">
                      <col.icon className="size-4 text-fg-muted" aria-hidden />
                      {col.label}
                      <span className="tabular rounded bg-surface-2 px-1.5 text-xs text-fg-muted">{items.length}</span>
                    </h2>
                    {items.map((t) => (
                      <article key={t.id} className="card p-3 transition-colors duration-200 hover:border-border-strong">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={cx("font-medium wrap-break-word", t.status === "done" && "text-fg-muted line-through")}>
                            {t.title}
                          </h3>
                          <IconButton label={`Excluir ${t.title}`} onClick={() => remove(t)} className="-mr-2 -mt-2 hover:text-danger">
                            <Trash2 className="size-4" />
                          </IconButton>
                        </div>
                        {t.description && <p className="mt-1 text-sm text-fg-muted wrap-break-word">{t.description}</p>}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className={cx("rounded border px-2 py-0.5 text-xs", PRIORITY[t.priority].className)}>
                            {PRIORITY[t.priority].label}
                          </span>
                          <label className="sr-only" htmlFor={`st-${t.id}`}>
                            Status de {t.title}
                          </label>
                          <select
                            id={`st-${t.id}`}
                            value={t.status}
                            onChange={(e) => move(t, e.target.value as TaskStatus)}
                            className="ml-auto min-h-9 rounded-md border border-border-strong bg-bg px-2 text-xs"
                          >
                            {STATUS.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </article>
                    ))}
                  </section>
                );
              })}
            </div>
          )}
        </div>

        <Card title="Requisições recentes" className="h-fit xl:sticky xl:top-8">
          {log.length === 0 ? (
            <p className="text-sm text-fg-muted">As chamadas às APIs aparecem aqui com o tempo medido no navegador.</p>
          ) : (
            <ol className="flex flex-col divide-y divide-border" aria-live="polite">
              {log.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-2 py-2 text-xs">
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <ArchBadge id={e.architecture} size="sm" />
                    <span className="truncate font-mono text-fg-muted">
                      {e.method} {e.path}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end font-mono tabular">
                    <span className={e.status >= 400 || e.status === 0 ? "text-danger" : "text-accent"}>{e.status || "—"}</span>
                    <span>{e.ms} ms</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </>
  );
}
