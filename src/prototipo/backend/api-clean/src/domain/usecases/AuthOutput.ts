import type { User } from "../entities/User";

export interface AuthOutput {
  token: string;
  user: User;
}
