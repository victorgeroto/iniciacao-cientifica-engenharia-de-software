export type ArchitectureId = "monolito" | "camadas" | "clean";

export interface ArchitectureMeta {
  id: ArchitectureId;
  label: string;
  short: string;
  /** Rótulo curto para eixos de gráfico (cabe em 375 px). */
  axis: string;
  port: number;
  /** Token CSS (definido em index.css). */
  colorVar: string;
  summary: string;
  structure: string[];
  /** Camada que concentra a regra de negócio (para a cobertura "de negócio"). */
  businessLayer: string;
}

export const ARCHITECTURES: ArchitectureMeta[] = [
  {
    id: "monolito",
    label: "Monólito",
    short: "A",
    axis: "A · Monólito",
    port: 3001,
    colorVar: "var(--color-arch-monolito)",
    summary: "Rotas, regras de negócio e SQL no mesmo arquivo. Linha de base do comparativo.",
    structure: ["src/server.ts"],
    businessLayer: "raiz",
  },
  {
    id: "camadas",
    label: "Camadas (MVC)",
    short: "B",
    axis: "B · Camadas",
    port: 3002,
    colorVar: "var(--color-arch-camadas)",
    summary: "Camadas horizontais: controllers → services → repositories → models.",
    structure: ["controllers/", "services/", "repositories/", "models/", "middlewares/", "routes/", "config/"],
    businessLayer: "services",
  },
  {
    id: "clean",
    label: "Clean Architecture",
    short: "C",
    axis: "C · Clean",
    port: 3003,
    colorVar: "var(--color-arch-clean)",
    summary: "Domínio no centro, portas e adaptadores; a infraestrutura depende do domínio.",
    structure: ["domain/entities", "domain/usecases", "domain/ports", "interfaces/controllers", "infrastructure/"],
    businessLayer: "domain",
  },
];

export const archById = (id: string) => ARCHITECTURES.find((a) => a.id === id) ?? ARCHITECTURES[0];
