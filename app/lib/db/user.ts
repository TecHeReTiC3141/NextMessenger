"use server"

import { User } from "@prisma/client";
import prisma from "@/app/lib/db/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { z } from "zod";
import { UserSettingsFormSchema } from "@/app/lib/schema";

export interface UserCredentials {
    name: string,
    email: string,
    password: string,
}

export type SessionUser =
    {
        id: string,
        description: string | null,
    } & {
    name?: string | null | undefined,
    email?: string | null | undefined,
    image?: string | null | undefined
} | undefined;

export async function createUser({name, email, password}: UserCredentials): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        }
    });
}

export async function getOtherUsers() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) return [];

    return await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            NOT: {
                email: session.user.email,
            }
        }
    });
}

export async function updateUserSettings(formData: FormData): Promise<User | null> {
    const res = UserSettingsFormSchema.safeParse(formData);
    if (res.success) {
        const {data} = res;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            throw new Error("Unauthorized");
        }
        return await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data,
        });
    }
    return null;
}