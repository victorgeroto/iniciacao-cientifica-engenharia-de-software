import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, forwardRef, useId } from "react";
import { Loader2 } from "lucide-react";
import { archById } from "../lib/architectures";

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-on-accent font-semibold shadow-[0_0_0_1px_rgb(34_197_94/0.4),0_8px_24px_-8px_rgb(34_197_94/0.55)] hover:bg-accent/90",
  secondary: "bg-surface-2 text-fg border border-border-strong hover:border-fg-muted hover:bg-surface-2/70",
  ghost: "text-fg-muted hover:text-fg hover:bg-surface-2",
  danger: "text-danger border border-danger/40 hover:bg-danger/10",
};

export function Button({
  variant = "primary",
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm transition-colors duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={cx(
        "inline-flex size-11 items-center justify-center rounded-lg text-fg-muted transition-colors duration-200 hover:bg-surface-2 hover:text-fg",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("card p-4 sm:p-5", className)}>
      {(title || actions) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            {title && <h2 className="text-sm font-semibold tracking-tight text-fg">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-fg-muted">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

/** Indicador numérico de destaque (faixa de KPIs). */
export function Kpi({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "accent";
}) {
  return (
    <div className="card flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-2 text-fg-muted">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        {icon && (
          <span aria-hidden className="inline-flex size-7 items-center justify-center rounded-lg border border-border bg-surface-2">
            {icon}
          </span>
        )}
      </div>
      <p className={cx("tabular text-2xl font-semibold tracking-tight", tone === "accent" && "text-accent")}>{value}</p>
      {hint && <p className="text-xs text-fg-muted">{hint}</p>}
    </div>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(
  function Input({ label, hint, error, className, id, ...rest }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const describedBy = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;
    return (
      <div className={cx("flex flex-col gap-1.5", className)}>
        <label htmlFor={inputId} className="text-sm font-medium text-fg">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cx(
            "min-h-11 rounded-lg border bg-bg px-3 text-fg placeholder:text-fg-muted/70 transition-colors duration-200",
            error ? "border-danger" : "border-border-strong focus:border-accent",
          )}
          {...rest}
        />
        {error ? (
          <p id={`${inputId}-err`} className="text-sm text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-fg-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

export function Select({ label, hint, children, className, id, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & FieldProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={selectId} className="text-sm font-medium text-fg">
        {label}
      </label>
      <select
        id={selectId}
        aria-describedby={hint ? `${selectId}-hint` : undefined}
        className="min-h-11 rounded-lg border border-border-strong bg-bg px-3 text-fg focus:border-accent"
        {...rest}
      >
        {children}
      </select>
      {hint && (
        <p id={`${selectId}-hint`} className="text-xs text-fg-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

export function ArchBadge({ id, size = "md" }: { id: string; size?: "sm" | "md" }) {
  const a = archById(id);
  return (
    <span className={cx("inline-flex items-center gap-2 font-medium", size === "sm" ? "text-xs" : "text-sm")}>
      <span
        aria-hidden
        className="inline-flex size-5 shrink-0 items-center justify-center rounded font-mono text-[11px] font-bold text-bg"
        style={{ background: a.colorVar }}
      >
        {a.short}
      </span>
      {a.label}
    </span>
  );
}

export function StatusDot({ online, label }: { online: boolean | null; label: string }) {
  const text = online === null ? "verificando" : online ? "online" : "offline";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
      <span
        aria-hidden
        className={cx("size-2 rounded-full", online === null ? "bg-fg-muted" : online ? "bg-accent" : "bg-danger")}
      />
      <span className="sr-only">{label}:</span>
      {text}
    </span>
  );
}

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center">
      <div className="text-fg-muted" aria-hidden>
        {icon}
      </div>
      <p className="font-medium">{title}</p>
      {children && <div className="max-w-md text-sm text-fg-muted">{children}</div>}
    </div>
  );
}

export function Alert({ tone = "danger", children }: { tone?: "danger" | "warning" | "info"; children: ReactNode }) {
  const styles = {
    danger: "border-danger/40 bg-danger/10 text-red-200",
    warning: "border-warning/40 bg-warning/10 text-amber-100",
    info: "border-border-strong bg-surface-2 text-fg",
  };
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cx("rounded-lg border px-3 py-2 text-sm", styles[tone])}>
      {children}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx("animate-pulse rounded-lg bg-surface-2", className)} />;
}

export { cx };
