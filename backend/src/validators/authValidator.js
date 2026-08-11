import { z } from "zod";
export const registerSchema = z.object({
  fullname: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
});
export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});
export const googleAuthSchema = z.object({ idToken: z.string().min(1) });
