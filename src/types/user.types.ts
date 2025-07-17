import { z } from "zod";

//zod schema for validating user data
export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).trim(),
  email: z.string().email().trim(),
  password: z.string().min(6).trim(),
  image: z.string().url().nullable(),
  createdAt: z.date(),
});

//Infered typescript type from the zod schema
export type UserType = z.infer<typeof UserSchema>;

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignUpType = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export type SignInType = z.infer<typeof SignInSchema>;
