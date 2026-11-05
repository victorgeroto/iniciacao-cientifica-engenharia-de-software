import { describe, expect, it } from "vitest";
import { countLoc, parseImports } from "../../src/codeMetrics";
import { normalizeParams, roundOrder, toCsv, LoadTestRun } from "../../src/loadtest";

describe("métricas de código", () => {
  it("conta só linhas de código, ignorando vazias e comentários", () => {
    const src = ["// comentário", "", "/* bloco", " continua */", "const a = 1;", "/** doc */ const b = 2;", "  "].join("\n");
    expect(countLoc(src)).toBe(2);
  });

  it("separa imports internos de pacotes externos", () => {
    const src = [
      'import express from "express";',
      'import { z } from "zod";',
      'import type { Task } from "../models/Task";',
      'import { MetricsRegistry } from "@proto/shared";',
      'export { x } from "./x";',
    ].join("\n");
    expect(parseImports(src)).toEqual({
      internal: ["../models/Task", "./x"],
      external: ["express", "zod", "@proto/shared"],
    });
  });
});

describe("teste de carga", () => {
  it("rotaciona a ordem das arquiteturas a cada rodada", () => {
    const a = ["monolito", "camadas", "clean"];
    expect(roundOrder(a, 0)).toEqual(["monolito", "camadas", "clean"]);
    expect(roundOrder(a, 1)).toEqual(["camadas", "clean", "monolito"]);
    expect(roundOrder(a, 2)).toEqual(["clean", "monolito", "camadas"]);
  });

  it("aplica limites e padrões aos parâmetros", () => {
    const p = normalizeParams({ connections: 9999, durationSeconds: 0, scenario: "x" as never, architectures: [] });
    expect(p).toMatchObject({ connections: 200, durationSeconds: 1, scenario: "list" });
    expect(p.architectures).toEqual(["monolito", "camadas", "clean"]);
  });

  it("exporta CSV com uma linha por arquitetura e rodada", () => {
    const run = {
      id: "r1",
      params: normalizeParams(),
      results: [
        {
          architecture: "monolito", round: 1, order: 1, requests: 100, requestsPerSecond: 10, throughputKBps: 1,
          latencyMs: { mean: 1, p50: 1, p90: 2, p99: 3, max: 4 }, errors: 0, non2xx: 0, server: null,
        },
      ],
    } as unknown as LoadTestRun;
    const lines = toCsv(run).trim().split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[1].startsWith("r1,list,10,10,1,1,monolito,100")).toBe(true);
  });
});
