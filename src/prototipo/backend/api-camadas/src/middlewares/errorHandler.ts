import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { HttpError } from "../models/HttpError";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    const body = err.details ? { error: err.message, details: err.details } : { error: err.message };
    return res.status(err.status).json(body);
  }
  console.error(`[${env.architecture}]`, err);
  res.status(500).json({ error: "Erro interno" });
}
