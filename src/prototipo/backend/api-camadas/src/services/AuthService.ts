import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "../models/HttpError";
import { loginSchema, registerSchema, User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

export interface AuthResult {
  token: string;
  user: User;
}

export class AuthService {
  constructor(private readonly users = new UserRepository()) {}

  private sign(user: User): string {
    return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: "8h" });
  }

  async register(body: unknown): Promise<AuthResult> {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) throw new HttpError(400, "Dados inválidos", parsed.error.issues);
    const { name, email, password } = parsed.data;
    if (await this.users.findByEmail(email)) throw new HttpError(409, "E-mail já cadastrado");
    const user = await this.users.create(name, email, await bcrypt.hash(password, 8));
    return { token: this.sign(user), user };
  }

  async login(body: unknown): Promise<AuthResult> {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) throw new HttpError(400, "Dados inválidos", parsed.error.issues);
    const found = await this.users.findByEmail(parsed.data.email);
    if (!found || !(await bcrypt.compare(parsed.data.password, found.passwordHash))) {
      throw new HttpError(401, "Credenciais inválidas");
    }
    const user = { id: found.id, name: found.name, email: found.email };
    return { token: this.sign(user), user };
  }

  verify(token: string): number {
    try {
      const payload = jwt.verify(token, env.jwtSecret) as unknown as { sub: number };
      return Number(payload.sub);
    } catch {
      throw new HttpError(401, "Token ausente ou inválido");
    }
  }
}
