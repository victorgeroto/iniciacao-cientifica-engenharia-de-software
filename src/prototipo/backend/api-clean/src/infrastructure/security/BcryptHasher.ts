import bcrypt from "bcryptjs";
import type { PasswordHasher } from "../../domain/ports";

export class BcryptHasher implements PasswordHasher {
  constructor(private readonly rounds = 8) {}

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
