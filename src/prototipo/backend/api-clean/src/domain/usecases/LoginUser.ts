import { UnauthorizedError } from "../errors/DomainErrors";
import type { PasswordHasher, TokenService, UserRepository } from "../ports";
import type { AuthOutput } from "./AuthOutput";

export class LoginUser {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: { email: string; password: string }): Promise<AuthOutput> {
    const found = await this.users.findByEmail(input.email);
    if (!found || !(await this.hasher.compare(input.password, found.passwordHash))) {
      throw new UnauthorizedError("Credenciais inválidas");
    }
    const user = { id: found.id, name: found.name, email: found.email };
    return { token: this.tokens.sign(user), user };
  }
}
