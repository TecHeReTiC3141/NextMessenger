import { z } from "zod";

export const LoginFormSchema = z.object({
    email: z.string().min(1, "Email must not be empty"),
    password: z.string().min(6, "Password must at least 6 characters long"),
});

export const RegisterFormSchema = LoginFormSchema.extend({
    name: z.string().min(1, "Name must not be empty"),
});