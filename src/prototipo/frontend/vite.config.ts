import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Mesmos prefixos do nginx de produção: o frontend nunca conhece portas.
const proxy = (target: string, prefix: string) => ({
  target,
  changeOrigin: true,
  rewrite: (p: string) => p.replace(new RegExp(`^${prefix}`), ""),
});

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api/monolito": proxy("http://localhost:3001", "/api/monolito"),
      "/api/camadas": proxy("http://localhost:3002", "/api/camadas"),
      "/api/clean": proxy("http://localhost:3003", "/api/clean"),
      "/bench": proxy("http://localhost:3000", "/bench"),
    },
  },
});
