"use server"

import { createUser, UserCredentials } from "@/app/lib/db/user";
import { z } from "zod";
import { RegisterFormSchema } from "@/app/lib/schema";

type RegisterInputs = z.infer<typeof RegisterFormSchema>;

export async function registerUser(formData: FormData) {
    const res = RegisterFormSchema.safeParse(formData);
    if (res.success) {
        const { data } = res;
        await createUser({
            name: data.name,
            email: data.email,
            password: data.password,
        });
    }
    return res.success;

}