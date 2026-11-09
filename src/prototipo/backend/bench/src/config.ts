import path from "node:path";

export type ArchitectureId = "monolito" | "camadas" | "clean";

export interface ArchitectureConfig {
  id: ArchitectureId;
  label: string;
  url: string;
  /** Pasta do código-fonte, para as métricas estáticas. */
  sourceDir: string;
}

const backendRoot = process.env.SOURCES_DIR ?? path.resolve(__dirname, "..", "..");

export const ARCHITECTURES: ArchitectureConfig[] = [
  {
    id: "monolito",
    label: "Módulo único",
    url: process.env.MONOLITO_URL ?? "http://localhost:3001",
    sourceDir: path.join(backendRoot, "api-monolito"),
  },
  {
    id: "camadas",
    label: "Camadas",
    url: process.env.CAMADAS_URL ?? "http://localhost:3002",
    sourceDir: path.join(backendRoot, "api-camadas"),
  },
  {
    id: "clean",
    label: "Clean Architecture",
    url: process.env.CLEAN_URL ?? "http://localhost:3003",
    sourceDir: path.join(backendRoot, "api-clean"),
  },
];

export const PORT = Number(process.env.PORT ?? 3000);
export const DATA_DIR = process.env.DATA_DIR ?? path.resolve(__dirname, "..", "data");
