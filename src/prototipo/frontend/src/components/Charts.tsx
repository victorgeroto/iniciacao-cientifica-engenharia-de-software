import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ARCHITECTURES, archById } from "../lib/architectures";

const axis = { stroke: "#a1a1aa", fontSize: 11, tickLine: false };
const grid = <CartesianGrid stroke="#232329" strokeDasharray="3 3" vertical={false} />;
const tooltipStyle = {
  contentStyle: { background: "#18181d", border: "1px solid #33333b", borderRadius: 10, color: "#fafafa", boxShadow: "0 12px 32px -12px rgb(0 0 0 / 0.6)" },
  labelStyle: { color: "#f8fafc", fontWeight: 600 },
  itemStyle: { color: "#f8fafc" },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};

const fmt = (v: number, unit: string) =>
  `${v.toLocaleString("pt-BR", { maximumFractionDigits: v < 10 ? 2 : 1 })}${unit ? ` ${unit}` : ""}`;

/** Uma barra por arquitetura; nome no eixo e valor rotulado em cada barra. */
export function ArchBarChart({
  data,
  unit = "",
  label,
  height = 220,
}: {
  data: Array<{ id: string; value: number | null }>;
  unit?: string;
  label: string;
  height?: number;
}) {
  const rows = data
    .filter((d) => d.value !== null)
    .map((d) => ({ name: archById(d.id).axis, id: d.id, value: d.value as number }));
  return (
    <figure aria-label={label} className="m-0">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={rows} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
          {grid}
          <XAxis dataKey="name" {...axis} interval={0} />
          <YAxis {...axis} width={48} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => [fmt(v, unit), label]} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={72} isAnimationActive={false}>
            {rows.map((r) => (
              <Cell key={r.id} fill={archById(r.id).colorVar} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              fill="#f8fafc"
              fontSize={12}
              formatter={(v: number) => fmt(v, unit)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}

/** Barras agrupadas: categorias no eixo X, uma série por arquitetura (com legenda nomeada). */
export function GroupedArchChart({
  categories,
  values,
  unit = "",
  label,
  height = 260,
}: {
  categories: string[];
  /** values[archId][categoria] */
  values: Record<string, Record<string, number>>;
  unit?: string;
  label: string;
  height?: number;
}) {
  const present = ARCHITECTURES.filter((a) => values[a.id]);
  const rows = categories.map((c) => ({
    category: c,
    ...Object.fromEntries(present.map((a) => [a.id, values[a.id]?.[c] ?? 0])),
  }));
  return (
    <figure aria-label={label} className="m-0">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={rows} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
          {grid}
          <XAxis dataKey="category" {...axis} />
          <YAxis {...axis} width={48} />
          <Tooltip {...tooltipStyle} formatter={(v: number, key: string) => [fmt(v, unit), archById(key).label]} />
          <Legend formatter={(key: string) => archById(key).label} wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
          {present.map((a) => (
            <Bar key={a.id} dataKey={a.id} fill={a.colorVar} radius={[4, 4, 0, 0]} maxBarSize={40} isAnimationActive={false}>
              <LabelList dataKey={a.id} position="top" fill="#d4d4d8" fontSize={11} formatter={(v: number) => fmt(v, "")} />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}
