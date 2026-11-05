import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await this.service.register(req.body));
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.service.login(req.body));
    } catch (err) {
      next(err);
    }
  };
}
