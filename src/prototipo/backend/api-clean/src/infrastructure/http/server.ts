import express from "express";
import { MetricsRegistry, mountMetricsEndpoints } from "@proto/shared";
import type { AuthenticateToken } from "../../domain/usecases/AuthenticateToken";
import type { AuthController } from "../../interfaces/controllers/AuthController";
import type { TaskController } from "../../interfaces/controllers/TaskController";
import type { Logger } from "../logger/Logger";
import { errorHandler } from "./middlewares";
import { buildRoutes } from "./routes";

export interface HttpDeps {
  architecture: string;
  tasks: TaskController;
  auth: AuthController;
  authenticate: AuthenticateToken;
  logger: Logger;
}

export function createHttpApp(deps: HttpDeps) {
  const app = express();
  const metrics = new MetricsRegistry(deps.architecture);
  app.use(metrics.middleware());
  app.use(express.json());
  mountMetricsEndpoints(app, metrics, deps.architecture);
  app.use(buildRoutes(deps.tasks, deps.auth, deps.authenticate));
  app.use(errorHandler(deps.logger));
  return app;
}
