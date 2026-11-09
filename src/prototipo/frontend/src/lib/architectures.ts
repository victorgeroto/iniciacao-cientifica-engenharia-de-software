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
    label: "Módulo único",
    short: "A",
    axis: "A · Módulo único",
    port: 3001,
    colorVar: "var(--color-arch-monolito)",
    summary: "Transaction Script: rotas, regras de negócio e SQL no mesmo módulo, sem separação de responsabilidades. Linha de base.",
    structure: ["src/server.ts"],
    businessLayer: "raiz",
  },
  {
    id: "camadas",
    label: "Camadas",
    short: "B",
    axis: "B · Camadas",
    port: 3002,
    colorVar: "var(--color-arch-camadas)",
    summary: "Arquitetura em camadas: controllers → services → repositories, cada camada depende da camada de baixo.",
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
    summary: "Domínio no centro, portas e adaptadores: a infraestrutura depende do domínio, e não o contrário.",
    structure: ["domain/entities", "domain/usecases", "domain/ports", "interfaces/controllers", "infrastructure/"],
    businessLayer: "domain",
  },
];

export const archById = (id: string) => ARCHITECTURES.find((a) => a.id === id) ?? ARCHITECTURES[0];
