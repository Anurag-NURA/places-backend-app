import { z } from "zod";

//zod schema for validating user data
export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

//Infered typescript type from the zod schema
export type User = z.infer<typeof UserSchema>;

export const updateUserSchema = UserSchema.omit({ id: true }).partial();

export type UpdateUser = z.infer<typeof updateUserSchema>;
