/**
 * Portas: contratos que o domínio exige da infraestrutura.
 * As implementações concretas (PostgreSQL, bcrypt, JWT) ficam em infrastructure/.
 */
import type { Task, TaskPriority, TaskStatus } from "../entities/Task";
import type { User, UserCredentials } from "../entities/User";

export interface NewTask {
  userId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface TaskRepository {
  listByUser(userId: number): Promise<Task[]>;
  findById(id: number, userId: number): Promise<Task | null>;
  create(task: NewTask): Promise<Task>;
  save(task: Task): Promise<Task>;
  delete(id: number, userId: number): Promise<boolean>;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserCredentials | null>;
  create(name: string, email: string, passwordHash: string): Promise<User>;
}

export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}

export interface TokenService {
  sign(user: User): string;
  verify(token: string): number;
}
