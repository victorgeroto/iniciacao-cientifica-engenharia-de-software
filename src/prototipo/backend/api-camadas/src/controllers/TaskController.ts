import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/TaskService";

type AuthedRequest = Request & { userId: number };

export class TaskController {
  constructor(private readonly service = new TaskService()) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.service.list((req as AuthedRequest).userId));
    } catch (err) {
      next(err);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.service.get((req as AuthedRequest).userId, req.params.id));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await this.service.create((req as AuthedRequest).userId, req.body));
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.service.update((req as AuthedRequest).userId, req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.remove((req as AuthedRequest).userId, req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}
