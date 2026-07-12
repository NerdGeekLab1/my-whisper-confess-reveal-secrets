import { z } from "zod";

// Strong-but-usable password: min 8 chars, at least one letter and one digit.
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password must be at most 128 characters" })
  .regex(/[A-Za-z]/, { message: "Password must include a letter" })
  .regex(/\d/, { message: "Password must include a number" });

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Enter a valid email address" })
  .max(255, { message: "Email must be at most 255 characters" });

export const usernameSchema = z
  .string()
  .trim()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(24, { message: "Username must be at most 24 characters" })
  .regex(/^[a-zA-Z0-9_.-]+$/, {
    message: "Username can only contain letters, numbers, dots, dashes and underscores",
  });

export const signupSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }).max(128),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
