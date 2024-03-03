"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import prisma from "@/app/lib/db/prisma";
import { Message, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { pusherServer } from "@/app/lib/pusher";

interface CreateMessageData {
    body: string,
    conversationId: string,
    image?: string,
}

export type MessageWithSeen = Message & { seen: User[] };
export type MessageWithSender = Message & { sender: User | null };
export type FullMessage = MessageWithSender & MessageWithSeen;

export async function createNewMessage({ body, image, conversationId }: CreateMessageData): Promise<FullMessage> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const newMessage = await prisma.message.create({
        data: {
            body,
            image,
            conversation: {
                connect: { id: conversationId },
            },
            sender: {
                connect: { id: session.user.id },
            },
            seen: {
                connect: { id: session.user.id },
            }
        },
        include: {
            seen: true,
            sender: true,
        }
    });

    const updatedConversation = await prisma.conversation.update({
        where: {
            id: conversationId,
        },
        data: {
            lastMessageAt: newMessage.createdAt
        },
        include: {
            users: true,
            messages: {
                include: {
                    seen: true,
                }
            }
        }
    });

    await pusherServer.trigger(conversationId, "message:new", newMessage);

    const lastMessage = updatedConversation.messages.at(-1);

    updatedConversation.users.map(async user => {
        await pusherServer.trigger(user.email as string, "conversation:update",
            { id: conversationId, lastMessageAt: updatedConversation.lastMessageAt, messages: [ lastMessage ] });
    })
    revalidatePath("/conversations/[conversationId]", "page");
    return newMessage;
}

export async function deleteMessageById(messageId: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const deletedMessage = await prisma.message.delete({
        where: {
            id: messageId,
            senderId: session.user.id,
        }
    });

    if (deletedMessage === null) {
        throw new Error("Couldn't find your message or it's not yours");
    }
    console.log("deleted message", deletedMessage);
    if (!deletedMessage.conversationId) return;
    await pusherServer.trigger(deletedMessage.conversationId, "message:delete", { id: messageId });
    const updatedConversation = await prisma.conversation.findUnique({
        where: {
            id: deletedMessage.conversationId,
        },
        include: {
            users: {
                select: {
                    email: true,
                }
            },
        }
    });
    if (updatedConversation && deletedMessage.createdAt === updatedConversation.lastMessageAt) {
        updatedConversation.users.map(async user => {
            await pusherServer.trigger(user.email as string, "conversation:deleteLastMessage",
                {conversationId: updatedConversation.id});
        });
    }
}

