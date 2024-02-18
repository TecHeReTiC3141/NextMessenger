"use server"

import prisma from "@/app/lib/db/prisma";
import { ConversationInList } from "@/app/lib/db/conversation";
import { createNewMessage, FullMessage } from "@/app/lib/db/message";
import { AddMessageFormSchema } from "@/app/lib/schema";

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

export async function handleNewMessage(formData: FormData): Promise<boolean | FullMessage> {
    const res = AddMessageFormSchema.safeParse(formData);
    if (res.success) {
        const {data: {message, image, conversationId}} = res;
        return await createNewMessage({body: message, image, conversationId});
    }
    return res.success;
}