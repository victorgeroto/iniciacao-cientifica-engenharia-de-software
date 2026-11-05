import { z } from "zod";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserWithPassword extends User {
  passwordHash: string;
}

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(6).max(100),
});
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});
