"use server"

import prisma from "@/app/lib/db/prisma";
import { ConversationInList } from "@/app/lib/db/conversation";
import { createNewMessage, FullMessage } from "@/app/lib/db/message";
import { AddMessageFormSchema } from "@/app/lib/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { redirect } from "next/navigation";

export default async function getConversationById(conversationId: string): Promise<ConversationInList | null> {
    return prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            users: true,
            messages: {
                include: {
                    seen: true,
                    sender: true,
                },
                orderBy: {
                    createdAt: 'asc',
                }
            }
        }
    });
}

export async function handleNewMessage(formData: FormData): Promise<boolean> {
    const res = AddMessageFormSchema.safeParse(formData);
    if (res.success) {
        const { data: { message, image, conversationId } } = res;
        await createNewMessage({ body: message, image, conversationId });
    }
    return res.success;
}

export async function setSeenLastMessage(conversationId: string): Promise<FullMessage | null> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return redirect("/");
    }

    const curConversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            messages: {
                select: {
                    id: true,
                    seen: true,
                }
            },
            users: true,
        }
    });

    if (!curConversation) {
        throw new Error("Invalid conversation ID");
    }
    if (curConversation.messages.length === 0) {
        return null;
    }
    const lastMessage = curConversation.messages.at(-1);

    if (!lastMessage || lastMessage.seen.filter(user => user.id === session.user.id).length > 0) {
        return null;
    }

    return await prisma.message.update({
        where: { id: lastMessage.id },
        data: {
            seen: {
                connect: {
                    id: session.user.id,
                }
            }
        },
        include: {
            seen: true,
            sender: true,
        }
    });
}