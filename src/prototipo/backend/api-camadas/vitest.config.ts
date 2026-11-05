import { defineConfig } from "vitest/config";

// Mesma configuração de cobertura nas três APIs: mede todo o src/.
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      reporter: ["text", "json-summary"],
      reportsDirectory: "coverage",
    },
  },
});
