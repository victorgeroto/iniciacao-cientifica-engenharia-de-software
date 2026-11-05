import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export function authMiddleware(service = new AuthService()) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    try {
      (req as Request & { userId: number }).userId = service.verify(token);
      next();
    } catch (err) {
      next(err);
    }
  };
}
