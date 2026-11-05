import express from "express";
import { MetricsRegistry, mountMetricsEndpoints } from "@proto/shared";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { buildRoutes } from "./routes";

export function createApp() {
  const app = express();
  const metrics = new MetricsRegistry(env.architecture);
  app.use(metrics.middleware());
  app.use(express.json());
  mountMetricsEndpoints(app, metrics, env.architecture);
  app.use(buildRoutes());
  app.use(errorHandler);
  return app;
}
