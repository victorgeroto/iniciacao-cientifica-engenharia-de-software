/** Validação de entrada na fronteira (adaptador), convertendo o corpo HTTP em DTOs do domínio. */
import { z } from "zod";
import { ValidationError } from "../../domain/errors/DomainErrors";

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(6).max(100),
});
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});
export const taskCreateSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(1000).default(""),
  status: z.enum(["todo", "doing", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});
export const taskUpdateSchema = taskCreateSchema.partial();

export function parse<T extends z.ZodTypeAny>(schema: T, body: unknown): z.infer<T> {
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new ValidationError("Dados inválidos", parsed.error.issues);
  return parsed.data;
}
