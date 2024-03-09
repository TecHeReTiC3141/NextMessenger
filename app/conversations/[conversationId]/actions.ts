"use server"

import prisma from "@/app/lib/db/prisma";
import { ConversationInList } from "@/app/lib/db/conversation";
import { createNewMessage, FullMessage, MessageWithSender, updateMessage } from "@/app/lib/db/message";
import { AddMessageFormSchema } from "@/app/lib/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import { redirect } from "next/navigation";
import { getPusherInstance } from "@/app/lib/pusher";
import { Message } from "@prisma/client";
import tenorAxios, { TenorResponse } from "@/app/api/tenor/tenorAxios";

export default async function getConversationById(conversationId: string): Promise<ConversationInList | null> {
    return prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            users: true,
            messages: {
                include: {
                    seen: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            email: true,
                        }
                    },
                    answeredMessage: {
                        select: {
                            id: true,
                            body: true,
                            image: true,
                            sender: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc',
                }
            }
        }
    });
}

export async function handleMessageFormSubmit(formData: FormData, editedId?: string, answeringId?: string): Promise<boolean> {
    const res = AddMessageFormSchema.safeParse(formData);
    if (res.success) {
        const { data: { message, image, conversationId } } = res;
        if (!editedId) {
            await createNewMessage({ body: message, image, conversationId, answeringId });
        } else {
            await updateMessage({ body: message, image, conversationId, messageId: editedId },);
        }
    }
    return res.success;
}

export async function setSeenLastMessage(conversationId: string): Promise<FullMessage | null> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return redirect("/");
    }

    const currentUser = session.user;

    const curConversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            messages: {
                select: {
                    id: true,
                    seen: {
                        select: {
                            id: true,
                        }
                    },
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

    if (!lastMessage || lastMessage.seen.filter(user => user.id === currentUser.id).length > 0) {
        return null;
    }

    const updatedMessage = await prisma.message.update({
        where: { id: lastMessage.id },
        data: {
            seen: {
                connect: {
                    id: currentUser.id,
                }
            }
        },
        include: {
            seen: true,
            sender: true,
        }
    });

    await getPusherInstance().trigger(currentUser.email as string, "conversation:update", {
        id: conversationId,
        messages: [ updatedMessage ],
        lastMessageAt: curConversation.lastMessageAt,
    });

    console.log("updated message", updatedMessage);
    await getPusherInstance().trigger(conversationId, "message:update", updatedMessage);
    return updatedMessage
}

export async function getEditedMessage(editedId: string): Promise<Message | null> {
    return prisma.message.findUnique({
        where: {
            id: editedId,
        }
    });
}

export async function getAnsweredMessage(answeredId: string): Promise<MessageWithSender | null> {
    return prisma.message.findUnique({
        where: {
            id: answeredId,
        },
        include: {
            sender: true,
        }
    });
}

export async function getGifs(query: string, mode: "search" | "featured" = "featured"): Promise<string[]> {
    let response: TenorResponse;
    if (mode === "featured") {
        response = (await tenorAxios.get<TenorResponse>("/featured", {
            params: {
                key: process.env.TENOR_API_KEY,
                client_key: "Next Messenger",
                country: "RU",
                locals: "ru_RU",
                limit: 16,
                media_filter: "gif,tinygif,mp4,tinymp4"
            }
        })).data;
    } else {
        if (!query) {
            throw new Error("No query provided");
        }
        response = (await tenorAxios.get<TenorResponse>("/search", {
            params: {
                key: process.env.TENOR_API_KEY,
                client_key: "Next Messenger",
                q: query,
                country: "RU",
                locals: "ru_RU",
                limit: 16,
                media_filter: "gif,tinygif,mp4,tinymp4"
            }
        })).data;

    }

    return response.results.map(res =>
        (res.media_formats.gif || res.media_formats.tinygif || res.media_formats.mp4).url
    );
}