"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import prisma from "@/app/lib/db/prisma";
import { Prisma } from "@prisma/client";


export type ConversationWithUsers = Prisma.ConversationGetPayload<{
    include: { users: true },
}>;

export interface ChatCreateData {
    userId: string,
}

export async function createChat({ userId }: ChatCreateData): Promise<ConversationWithUsers | null> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;

    const currentUser = session.user;

    const existingConversations = await prisma.conversation.findMany({
        where: {
            isGroup: false,
            userIds: {
                hasEvery: [ currentUser.id, userId ],
            },
        },
        include: {
            users: true,
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

export async function createGroupChat({ name, members }: GroupChatCreateData): Promise<ConversationWithUsers | null> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;

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

export type ConversationWithMessages = Prisma.ConversationGetPayload<{
    include: {
        messages: {
            include: {
                sender: true,
                seen: true,
            }
        }
    }
}>;

export type ConversationInList = ConversationWithMessages & ConversationWithUsers;

export async function getUserConversations(): Promise<ConversationInList[]> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return [];
    }
    return prisma.conversation.findMany({
        where: {
            userIds: {
                has: session.user.id,
            },
        },
        orderBy: { lastMessageAt: 'desc' },
        include: {
            users: true,
            messages: {
                include: {
                    sender: true,
                    seen: true,
                }
            }
        }
    });
}

