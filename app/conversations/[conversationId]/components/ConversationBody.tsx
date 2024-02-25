"use client"

import { FullMessage } from "@/app/lib/db/message";
import { useState, useRef, useEffect } from "react";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "@/app/conversations/[conversationId]/components/MessageBox";
import { setSeenLastMessage } from "@/app/conversations/[conversationId]/actions";
import { pusherClient } from "@/app/lib/pusher";
import {find} from "lodash";

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

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef?.current?.scrollIntoView();

        function messageHandler(newMessage: FullMessage) {
            setMessages(prev => {
                if (find(prev, {id: newMessage.id})) {
                    return prev;
                }
                return [...prev, newMessage];
            });
            bottomRef?.current?.scrollIntoView();
            setSeenLastMessage(conversationId).then(() => console.log("seen updated"));
        }

        pusherClient.bind("message:new", messageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("message:new", messageHandler);
        };
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