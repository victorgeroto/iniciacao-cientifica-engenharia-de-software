import { ARCHITECTURES, ArchitectureId } from "../lib/architectures";
import { cx } from "./ui";

/** Grupo de rádio acessível (setas do teclado funcionam nativamente). */
export function ArchitectureSelector({
  value,
  onChange,
  online,
}: {
  value: ArchitectureId;
  onChange: (id: ArchitectureId) => void;
  online?: Partial<Record<ArchitectureId, boolean>>;
}) {
  return (
    <fieldset className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <legend className="sr-only">Arquitetura ativa</legend>
      {ARCHITECTURES.map((a) => {
        const checked = a.id === value;
        const isOffline = online && online[a.id] === false;
        return (
          <label
            key={a.id}
            className={cx(
              "group relative flex min-h-16 items-start gap-3 rounded-2xl border bg-surface p-3.5 transition-all duration-200",
              checked
                ? "border-[color:var(--c)] bg-surface-2 shadow-[0_0_0_1px_var(--c),0_10px_30px_-12px_var(--c)]"
                : "border-border hover:border-border-strong hover:bg-surface-2/60",
            )}
            style={{ ["--c" as string]: a.colorVar }}
          >
            <input
              type="radio"
              name="arquitetura"
              value={a.id}
              checked={checked}
              onChange={() => onChange(a.id)}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-sm font-bold text-bg"
              style={{ background: a.colorVar }}
            >
              {a.short}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-medium">{a.label}</span>
              <span className="font-mono text-xs text-fg-muted">
                :{a.port}
                {isOffline && <span className="ml-2 text-danger">offline</span>}
              </span>
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-accent peer-focus-visible:ring-2"
            />
          </label>
        );
      })}
    </fieldset>
  );
}
