import type { LoginUser } from "../../domain/usecases/LoginUser";
import type { RegisterUser } from "../../domain/usecases/RegisterUser";
import type { HttpRequest, HttpResponse } from "./HttpTypes";
import { loginSchema, parse, registerSchema } from "./validators";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
  ) {}

  async register(req: HttpRequest): Promise<HttpResponse> {
    return { status: 201, body: await this.registerUser.execute(parse(registerSchema, req.body)) };
  }

  async login(req: HttpRequest): Promise<HttpResponse> {
    return { status: 200, body: await this.loginUser.execute(parse(loginSchema, req.body)) };
  }
}
