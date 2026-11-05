/**
 * Métricas estáticas de código, calculadas da mesma forma para as três versões.
 *
 * - LOC: linhas não vazias que não são só comentário.
 * - Camada: primeira pasta abaixo de src/ ("raiz" para arquivos soltos).
 * - Acoplamento: fan-out interno (imports relativos por arquivo) e dependências
 *   entre camadas distintas.
 * - Cobertura: lida de coverage/coverage-summary.json, gerado por `npm run coverage`.
 */
import fs from "node:fs";
import path from "node:path";

export interface FileMetrics {
  file: string;
  layer: string;
  loc: number;
  internalImports: string[];
  externalImports: string[];
}

export interface CoverageSummary {
  lines: number;
  statements: number;
  functions: number;
  branches: number;
}

export interface CodeMetrics {
  files: number;
  loc: number;
  locByLayer: Record<string, number>;
  filesByLayer: Record<string, number>;
  avgFanOut: number;
  maxFanOut: number;
  crossLayerDependencies: number;
  layerDependencies: Record<string, string[]>;
  externalPackages: string[];
  tests: { files: number; loc: number };
  coverage: CoverageSummary | null;
  coverageByLayer: Record<string, number> | null;
}

export function countLoc(source: string): number {
  let inBlock = false;
  let count = 0;
  for (const raw of source.split(/\r?\n/)) {
    let line = raw.trim();
    if (inBlock) {
      const end = line.indexOf("*/");
      if (end === -1) continue;
      inBlock = false;
      line = line.slice(end + 2).trim();
    }
    if (line.startsWith("/*")) {
      const end = line.indexOf("*/", 2);
      if (end === -1) {
        inBlock = true;
        continue;
      }
      line = line.slice(end + 2).trim();
    }
    if (line === "" || line.startsWith("//")) continue;
    count++;
  }
  return count;
}

const IMPORT_RE = /(?:import|export)\s[^'"]*?from\s+["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)/g;

export function parseImports(source: string): { internal: string[]; external: string[] } {
  const internal: string[] = [];
  const external: string[] = [];
  for (const m of source.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2];
    if (spec.startsWith(".")) internal.push(spec);
    else external.push(spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]);
  }
  return { internal, external };
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return e.isFile() && e.name.endsWith(".ts") && !e.name.endsWith(".d.ts") ? [full] : [];
  });
}

function layerOf(srcDir: string, file: string): string {
  const rel = path.relative(srcDir, file).split(path.sep);
  return rel.length > 1 ? rel[0] : "raiz";
}

interface CoverageEntry {
  lines: { total: number; covered: number; pct: number };
  statements: { pct: number };
  functions: { pct: number };
  branches: { pct: number };
}

function readCoverage(projectDir: string, srcDir: string): { total: CoverageSummary; byLayer: Record<string, number> } | null {
  const file = path.join(projectDir, "coverage", "coverage-summary.json");
  if (!fs.existsSync(file)) return null;
  const summary: Record<string, CoverageEntry> = JSON.parse(fs.readFileSync(file, "utf8"));
  const { total, ...perFile } = summary;
  // Cobertura de linhas agregada por camada (mesma regra de camada das demais métricas).
  const acc: Record<string, { total: number; covered: number }> = {};
  for (const [filePath, entry] of Object.entries(perFile)) {
    const layer = layerOf(srcDir, path.resolve(filePath));
    acc[layer] ??= { total: 0, covered: 0 };
    acc[layer].total += entry.lines.total;
    acc[layer].covered += entry.lines.covered;
  }
  const byLayer = Object.fromEntries(
    Object.entries(acc).map(([k, v]) => [k, v.total ? +((v.covered / v.total) * 100).toFixed(2) : 0]),
  );
  return {
    total: {
      lines: total.lines.pct,
      statements: total.statements.pct,
      functions: total.functions.pct,
      branches: total.branches.pct,
    },
    byLayer,
  };
}

export function analyzeProject(projectDir: string): CodeMetrics {
  const srcDir = path.join(projectDir, "src");
  const files: FileMetrics[] = walk(srcDir).map((file) => {
    const source = fs.readFileSync(file, "utf8");
    const { internal, external } = parseImports(source);
    return {
      file: path.relative(srcDir, file).split(path.sep).join("/"),
      layer: layerOf(srcDir, file),
      loc: countLoc(source),
      internalImports: internal,
      externalImports: external,
    };
  });

  const locByLayer: Record<string, number> = {};
  const filesByLayer: Record<string, number> = {};
  const layerDeps = new Map<string, Set<string>>();
  let crossLayer = 0;

  for (const f of files) {
    locByLayer[f.layer] = (locByLayer[f.layer] ?? 0) + f.loc;
    filesByLayer[f.layer] = (filesByLayer[f.layer] ?? 0) + 1;
    for (const spec of f.internalImports) {
      const target = path.resolve(srcDir, path.dirname(f.file), spec);
      const targetLayer = layerOf(srcDir, target + ".ts");
      if (targetLayer !== f.layer) {
        crossLayer++;
        if (!layerDeps.has(f.layer)) layerDeps.set(f.layer, new Set());
        layerDeps.get(f.layer)!.add(targetLayer);
      }
    }
  }

  const fanOuts = files.map((f) => f.internalImports.length);
  const tests = walk(path.join(projectDir, "test"));
  const coverage = readCoverage(projectDir, srcDir);

  return {
    files: files.length,
    loc: files.reduce((s, f) => s + f.loc, 0),
    locByLayer,
    filesByLayer,
    avgFanOut: files.length ? +(fanOuts.reduce((a, b) => a + b, 0) / files.length).toFixed(2) : 0,
    maxFanOut: fanOuts.length ? Math.max(...fanOuts) : 0,
    crossLayerDependencies: crossLayer,
    layerDependencies: Object.fromEntries([...layerDeps].map(([k, v]) => [k, [...v].sort()])),
    externalPackages: [...new Set(files.flatMap((f) => f.externalImports))].sort(),
    tests: { files: tests.length, loc: tests.reduce((s, t) => s + countLoc(fs.readFileSync(t, "utf8")), 0) },
    coverage: coverage?.total ?? null,
    coverageByLayer: coverage?.byLayer ?? null,
  };
}
