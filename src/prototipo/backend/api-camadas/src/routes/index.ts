import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware } from "../middlewares/auth";

export function buildRoutes(tasks = new TaskController(), auth = new AuthController()): Router {
  const router = Router();
  const requireAuth = authMiddleware();
  router.post("/auth/register", auth.register);
  router.post("/auth/login", auth.login);
  router.get("/tasks", requireAuth, tasks.list);
  router.get("/tasks/:id", requireAuth, tasks.get);
  router.post("/tasks", requireAuth, tasks.create);
  router.put("/tasks/:id", requireAuth, tasks.update);
  router.delete("/tasks/:id", requireAuth, tasks.remove);
  return router;
}
