import z from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    PUSHER_APP_ID: z.string().min(1),
    NEXT_PUBLIC_PUSHER_APP_KEY: z.string().min(1),
    PUSHER_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);