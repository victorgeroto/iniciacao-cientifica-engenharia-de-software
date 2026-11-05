/** Adapta controllers neutros (HttpRequest/HttpResponse) para handlers do Express. */
import type { NextFunction, Request, Response } from "express";
import type { HttpRequest, HttpResponse } from "../../interfaces/controllers/HttpTypes";

export function adapt(handler: (req: HttpRequest) => Promise<HttpResponse>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await handler({
        body: req.body,
        params: req.params,
        userId: (req as Request & { userId?: number }).userId,
      });
      if (result.body === undefined) res.status(result.status).end();
      else res.status(result.status).json(result.body);
    } catch (err) {
      next(err);
    }
  };
}
