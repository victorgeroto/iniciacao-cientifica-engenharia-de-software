import jwt from "jsonwebtoken";
import type { User } from "../../domain/entities/User";
import { UnauthorizedError } from "../../domain/errors/DomainErrors";
import type { TokenService } from "../../domain/ports";

export class JwtTokenService implements TokenService {
  constructor(private readonly secret: string) {}

  sign(user: User): string {
    return jwt.sign({ sub: user.id, email: user.email }, this.secret, { expiresIn: "8h" });
  }

  verify(token: string): number {
    try {
      const payload = jwt.verify(token, this.secret) as unknown as { sub: number };
      return Number(payload.sub);
    } catch {
      throw new UnauthorizedError("Token ausente ou inválido");
    }
  }
}
