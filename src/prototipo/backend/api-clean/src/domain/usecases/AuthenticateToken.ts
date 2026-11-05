import type { TokenService } from "../ports";

export class AuthenticateToken {
  constructor(private readonly tokens: TokenService) {}

  execute(token: string): number {
    return this.tokens.verify(token);
  }
}
