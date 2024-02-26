"use client"

import { ConversationInList } from "@/app/lib/db/conversation";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useConversation from "@/app/hooks/useConversation";
import { MdGroupAdd } from "react-icons/md";
import ConversationBox from "@/app/conversations/components/ConversationBox";
import clsx from "clsx";
import { User } from "@prisma/client";
import GroupChatModal from "@/app/conversations/components/GroupChatModal";
import { openModal } from "@/app/components/Modal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/lib/pusher";
import { find } from "lodash";
import { FullMessage, MessageWithSeen } from "@/app/lib/db/message";


interface ConversationsListProps {
    initialItems: ConversationInList[],
    otherUsers: User[],
}

export default function ConversationsList({ initialItems, otherUsers }: ConversationsListProps) {

    const session = useSession();
    const [ items, setItems ] = useState(initialItems);
    const router = useRouter();

    const pusherKey = useMemo(() =>
        session?.data?.user?.email, [ session?.data?.user?.email ]);

    const { conversationId, isOpen } = useConversation();

    useEffect(() => {
        if (!pusherKey) {
            return;
        }

        function newConversationHandler(newConversation: ConversationInList) {
            setItems(prev => {
                if (find(prev, { id: newConversation.id })) {
                    return prev;
                }
                return [ newConversation, ...prev ];
            })
        }

        function updateConversationHandler(updatedConversation: {
            id: string,
            lastMessageAt: Date,
            messages: FullMessage[]
        }) {
            setItems(prev => {
                return prev.map(conversation => {
                    if (conversation.id !== updatedConversation.id) {
                        return conversation;
                    }
                    return {
                        ...conversation,
                        messages: [ ...conversation.messages, ...updatedConversation.messages ],
                        lastMessageAt: updatedConversation.lastMessageAt,
                    }
                }).sort((c1, c2) => new Date(c2.lastMessageAt).getTime() - new Date(c1.lastMessageAt).getTime());
            })
        }

        function removeConversationHandler(deletedConversation: ConversationInList) {
            setItems(prev =>
                prev.filter(conversation => conversation.id !== deletedConversation.id));
            if (conversationId === deletedConversation.id) {
                router.push("/conversations");
            }
        }

        pusherClient.subscribe(pusherKey);
        pusherClient.bind("conversation:new", newConversationHandler);
        pusherClient.bind("conversation:update", updateConversationHandler);
        pusherClient.bind("conversation:remove", removeConversationHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind("conversation:new", newConversationHandler);
            pusherClient.unbind("conversation:update", updateConversationHandler);
            pusherClient.unbind("conversation:remove", removeConversationHandler);
        }
    }, [ pusherKey ]);

    return (
        <>
            <aside
                className={clsx(isOpen && "max-lg:hidden",
                    "fixed inset-y-0 w-full pb-20 lg:w-80 lg:pb-0 lg:left-20 border-r border-base-300 left-0")}>
                <div>
                    <div className="flex justify-between py-4 px-3">
                        <div className="text-2xl font-bold">
                            Chats
                        </div>
                        <button onClick={() => openModal("add-group-chat")}
                                className="rounded-full p-2 bg-gray-100 hover:bg-gray-300 cursor-pointer">
                            <MdGroupAdd size={20}/>
                        </button>
                    </div>
                    {items.map(conversation => (
                        <ConversationBox key={conversation.id} conversation={conversation}
                                         selected={conversation.id === conversationId}/>
                    ))}
                </div>
            </aside>
            <GroupChatModal users={otherUsers}/>
        </>
    )
}