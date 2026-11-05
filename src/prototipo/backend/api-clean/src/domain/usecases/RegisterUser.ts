import { ConflictError } from "../errors/DomainErrors";
import type { PasswordHasher, TokenService, UserRepository } from "../ports";
import type { AuthOutput } from "./AuthOutput";

export class RegisterUser {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: { name: string; email: string; password: string }): Promise<AuthOutput> {
    if (await this.users.findByEmail(input.email)) throw new ConflictError("E-mail já cadastrado");
    const user = await this.users.create(input.name, input.email, await this.hasher.hash(input.password));
    return { token: this.tokens.sign(user), user };
  }
}
