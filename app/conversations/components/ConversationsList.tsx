"use client"

import { ConversationInList } from "@/app/lib/db/conversation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useConversation from "@/app/hooks/useConversation";
import { MdGroupAdd } from "react-icons/md";
import ConversationBox from "@/app/conversations/components/ConversationBox";


interface ConversationsListProps {
    initialItems: ConversationInList[],
}

export default function ConversationsList({ initialItems }: ConversationsListProps) {

    const [ items, setItems ] = useState(initialItems);
    const router = useRouter();

    const { conversationId, isOpen } = useConversation();

    return (
        <aside
            className="fixed inset-y-0 w-full block pb-20 lg:w-80 lg:pb-0 lg:left-20 border-r border-base-300 left-0">
            <div>
                <div className="flex justify-between py-4 px-3">
                    <div className="text-2xl font-bold">
                        Chats
                    </div>
                    <div className="rounded-full p-2 bg-gray-100 hover:bg-gray-300 cursor-pointer">
                        <MdGroupAdd size={20} />
                    </div>
                </div>
                {items.map(conversation => (
                    <ConversationBox key={conversation.id} conversation={conversation} selected={conversation.id === conversationId}/>
                ))}
            </div>
        </aside>
    )
}