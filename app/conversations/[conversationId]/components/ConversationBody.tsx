"use client"

import { FullMessage } from "@/app/lib/db/message";
import { useState, useRef, useEffect } from "react";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "@/app/conversations/[conversationId]/components/MessageBox";
import { setSeenLastMessage } from "@/app/conversations/[conversationId]/actions";

interface ConversationBodyProps {
    initialMessages: FullMessage[],
}

export default function ConversationBody({ initialMessages }: ConversationBodyProps) {

    const [ messages, setMessages ] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect( () => {
        setSeenLastMessage(conversationId).then(() => console.log("seen updated"));
    }, [conversationId]);

    return (
        <div className="flex-1 bg-base-200 px-2 overflow-y-auto">
            {messages.map((message, index) => (
                <MessageBox message={message} isLast={index === messages.length - 1} key={message.id} />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>
    )
}