import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./config";
import type { LoadTestRun } from "./loadtest";

const FILE = path.join(DATA_DIR, "resultados.json");

export class RunStore {
  private runs: LoadTestRun[] = [];

  constructor() {
    if (fs.existsSync(FILE)) {
      this.runs = JSON.parse(fs.readFileSync(FILE, "utf8"));
      // Execuções interrompidas por reinício não terminam mais.
      for (const r of this.runs) if (r.status === "running") r.status = "failed";
    }
  }

  list(): LoadTestRun[] {
    return [...this.runs].reverse();
  }

  get(id: string): LoadTestRun | undefined {
    return this.runs.find((r) => r.id === id);
  }

  running(): LoadTestRun | undefined {
    return this.runs.find((r) => r.status === "running");
  }

  add(run: LoadTestRun): void {
    this.runs.push(run);
    this.save();
  }

  remove(id: string): boolean {
    const before = this.runs.length;
    this.runs = this.runs.filter((r) => r.id !== id || r.status === "running");
    this.save();
    return this.runs.length < before;
  }

  save(): void {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(this.runs, null, 2));
  }
}
