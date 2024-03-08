"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";
import prisma from "@/app/lib/db/prisma";
import { Message } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getPusherInstance } from "@/app/lib/pusher";

type CreateMessageData = {
    body?: string,
    image?: string,
    conversationId: string,
    answeringId?: string,
}

export type MessageSender = {id: string, name: string | null, image: string | null} | null
export type MessageWithSeen = Message & { seen: { id: string, name: string | null }[] };
export type MessageWithSender = Message & { sender: MessageSender };
export type MessageWithAnsweringMessage = Message & {
    answeredMessage?: {
        id: string,
        body?: string | null,
        image?: string | null,
        sender: MessageSender,
    } | null,
};
export type FullMessage = MessageWithSender & MessageWithSeen & MessageWithAnsweringMessage;

export async function createNewMessage({
                                           body,
                                           image,
                                           conversationId,
                                           answeringId
                                       }: CreateMessageData): Promise<FullMessage> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    let newMessage: FullMessage;

    if (answeringId) {
        newMessage = await prisma.message.create({
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
                },
                answeredMessage: {
                    connect: {
                        id: answeringId,
                    }
                }
            },
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
            }
        });
    } else {

        newMessage = await prisma.message.create({
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
                    }
                },
            }
        });
    }

    const updatedConversation = await prisma.conversation.update({
        where: {
            id: conversationId,
        },
        data: {
            lastMessageAt: newMessage.createdAt,
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
    console.log(newMessage);

    await getPusherInstance().trigger(conversationId, "message:new", newMessage);

    const lastMessage = updatedConversation.messages.at(-1);

    updatedConversation.users.map(async user => {
        await getPusherInstance().trigger(user.email as string, "conversation:update",
            { id: conversationId, lastMessageAt: updatedConversation.lastMessageAt, messages: [ lastMessage ] });
    })
    revalidatePath("/conversations/[conversationId]", "page");
    return newMessage;
}

type UpdateMessageData = CreateMessageData & { messageId: string };

export async function updateMessage({ body, image, messageId }: UpdateMessageData,) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const updatedMessage = await prisma.message.update({
        where: {
            id: messageId,
        },
        data: {
            body: body,
            image: image,
            isEdited: true,
        },
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
        }
    });
    if (updatedMessage === null) {
        throw new Error("Invalid ID")
    }
    if (!updatedMessage.conversationId) return;
    await getPusherInstance().trigger(updatedMessage.conversationId, "message:update", updatedMessage);
    revalidatePath("/conversations/[conversationId]", "page");
    const updatedConversation = await prisma.conversation.findUnique({
        where: {
            id: updatedMessage.conversationId,
        },
        include: {
            users: {
                select: {
                    email: true,
                }
            },
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
                    createdAt: "asc",
                }
            }
        },
    });
    if (!updatedConversation) {
        return;
    }

    console.log("In update messages", updatedConversation?.messages, updatedMessage.createdAt, updatedConversation?.lastMessageAt);
    if (updatedMessage.createdAt.getTime() === updatedConversation.lastMessageAt.getTime()) {
        updatedConversation.users.map(async user => {
            await getPusherInstance().trigger(user.email as string, "conversation:setMessages",
                { id: updatedConversation.id, messages: updatedConversation.messages });
        });
    }
}

export async function deleteMessageById(messageId: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    const deletedMessage = await prisma.message.findUnique({
        where: {
            id: messageId,
            senderId: session.user.id,
        },
        include: {
            answers: {
                select: {
                    id: true,
                }
            }
        }
    });

    if (deletedMessage === null) {
        throw new Error("Couldn't find your message or it's not yours");
    }
    deletedMessage.answers.map(async ({id}) => {
        await prisma.message.update({
            where: {
                id,
            },
            data: {
                answeredMessage: {
                    disconnect: true,
                },
            }
        })
    });
    await prisma.message.delete({
        where: {
            id: deletedMessage.id,
        }
    })
    if (!deletedMessage.conversationId) return;
    await getPusherInstance().trigger(deletedMessage.conversationId, "message:delete", { id: messageId });
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
            messages: {
                select: {
                    id: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "asc",
                }
            }
        },
    });
    if (!updatedConversation) {
        return;
    }

    if (updatedConversation && deletedMessage.createdAt.getTime() === updatedConversation.lastMessageAt.getTime()) {
        const lastMessage = updatedConversation.messages.at(-1);
        if (lastMessage) {
            const newUpdatedConversation = await prisma.conversation.update({
                where: {
                    id: updatedConversation.id,
                },
                data: {
                    lastMessageAt: lastMessage.createdAt,
                },
                select: {
                    id: true,
                    messages: true,
                }
            });
            updatedConversation.users.map(async user => {
                await getPusherInstance().trigger(user.email as string, "conversation:setMessages",
                    { id: updatedConversation.id, messages: newUpdatedConversation.messages });
            });
        }
    }
    revalidatePath("/conversations/[conversationId]", "page");
}

