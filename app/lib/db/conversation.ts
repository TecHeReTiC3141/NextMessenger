"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import prisma from "@/app/lib/db/prisma";

export interface ChatCreateData {
    userId: string,
}

export async function createChat({ userId }: ChatCreateData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return;

    const currentUser = session.user;

    const existingConversations = await prisma.conversation.findMany({
        where: {
            isGroup: false,
            userIds: {
                hasEvery: [currentUser.id, userId],
            }
        }
    });
    if (existingConversations.length > 0) {
        return existingConversations[0];
    }

    return prisma.conversation.create({
        data: {
            isGroup: false,
            users: {
                connect: [
                    { id: currentUser.id },
                    { id: userId },
                ]
            }
        },
        include: {
            users: true,
        }
    });
}

export interface GroupChatCreateData {
    members: { id: string }[],
    name: string,
}

export async function createGroupChat({ name, members }: GroupChatCreateData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return;

    const currentUser = session.user;

    return prisma.conversation.create({
        data: {
            name,
            isGroup: true,
            users: {
                connect: [
                    { id: currentUser.id },
                    ...(members.map(member => (
                        { id: member.id }
                    ))),
                ]
            }
        },
        include: {
            users: true,
        }
    });
}
