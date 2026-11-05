import { Router } from "express";
import type { AuthenticateToken } from "../../../domain/usecases/AuthenticateToken";
import type { AuthController } from "../../../interfaces/controllers/AuthController";
import type { TaskController } from "../../../interfaces/controllers/TaskController";
import { adapt } from "../adapt";
import { requireAuth } from "../middlewares";

export function buildRoutes(tasks: TaskController, auth: AuthController, authenticate: AuthenticateToken): Router {
  const router = Router();
  const guard = requireAuth(authenticate);
  router.post("/auth/register", adapt((r) => auth.register(r)));
  router.post("/auth/login", adapt((r) => auth.login(r)));
  router.get("/tasks", guard, adapt((r) => tasks.list(r)));
  router.get("/tasks/:id", guard, adapt((r) => tasks.get(r)));
  router.post("/tasks", guard, adapt((r) => tasks.create(r)));
  router.put("/tasks/:id", guard, adapt((r) => tasks.update(r)));
  router.delete("/tasks/:id", guard, adapt((r) => tasks.remove(r)));
  return router;
}
