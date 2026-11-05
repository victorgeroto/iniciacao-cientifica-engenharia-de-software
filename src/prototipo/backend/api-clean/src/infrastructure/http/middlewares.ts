import type { NextFunction, Request, Response } from "express";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../domain/errors/DomainErrors";
import type { AuthenticateToken } from "../../domain/usecases/AuthenticateToken";
import type { Logger } from "../logger/Logger";

export function requireAuth(authenticate: AuthenticateToken) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    try {
      (req as Request & { userId: number }).userId = authenticate.execute(token);
      next();
    } catch (err) {
      next(err);
    }
  };
}

/** Traduz erros de domínio para status HTTP. */
export function errorHandler(logger: Logger) {
  return (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ValidationError) {
      const body = err.details ? { error: err.message, details: err.details } : { error: err.message };
      return res.status(400).json(body);
    }
    if (err instanceof UnauthorizedError) return res.status(401).json({ error: err.message });
    if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
    if (err instanceof ConflictError) return res.status(409).json({ error: err.message });
    logger.error("erro não tratado", err);
    res.status(500).json({ error: "Erro interno" });
  };
}
