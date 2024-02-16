"use server"

import { User } from "@prisma/client";
import prisma from "@/app/lib/db/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";

export interface UserCredentials {
    name: string,
    email: string,
    password: string,
}

export type SessionUser =
    {
        id: string,
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

