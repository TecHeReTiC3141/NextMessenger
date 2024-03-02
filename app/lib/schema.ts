import { z } from "zod";

const nameInput = z.string().min(1, "Name must not be empty");

export const LoginFormSchema = z.object({
    email: z.string().min(1, "Email must not be empty"),
    password: z.string().min(6, "Password must at least 6 characters long"),
});

export const RegisterFormSchema = LoginFormSchema.extend({
    name: nameInput,
});

export const AddMessageFormSchema = z.object({
    message: z.string().optional(),
    image: z.string().optional(),
    conversationId: z.string().min(1, "Internal error with conversationId"),
}).refine(
    data => {
        if (!data.message && !data.image) {
            return { message: 'Either message or image must be present' };
        }
        return true;
    }
);

export const UserSettingsFormSchema = z.object({
    name: nameInput,
    image: z.string().optional(),
    description: z.string().optional(),
});

const memberSchema = z.object({
    value: z.string().min(1),
    label: z.string().min(1),
})

export const CreateGroupChatSchema = z.object({
    name: nameInput,
    members: z.array(memberSchema).min(2, "At least two users must present"),
})