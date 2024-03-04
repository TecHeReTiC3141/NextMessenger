"use client"

import { FullMessage } from "@/app/lib/db/message";
import { useEffect, useRef, useState } from "react";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "@/app/conversations/[conversationId]/components/message/MessageBox";
import { setSeenLastMessage } from "@/app/conversations/[conversationId]/actions";
import { pusherClient } from "@/app/lib/pusher";
import { find } from "lodash";

interface ConversationBodyProps {
    initialMessages: FullMessage[],
}

export default function ConversationBody({ initialMessages }: ConversationBodyProps) {

    const [ messages, setMessages ] = useState(initialMessages);
    const [ messageWithActionMenu, setMessageWithActionMenu ] = useState<string>("");
    const [ editedMessage, setEditedMessage ] = useState<FullMessage | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        setSeenLastMessage(conversationId).then(() => console.log("seen updated"));
    }, [ conversationId ]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);
        bottomRef?.current?.scrollIntoView();

        function newMessageHandler(newMessage: FullMessage) {
            setMessages(prev => {
                if (find(prev, { id: newMessage.id })) {
                    return prev;
                }
                return [ ...prev, newMessage ];
            });
            bottomRef?.current?.scrollIntoView();
            setSeenLastMessage(conversationId).then(() => console.log("seen updated"));
        }

        function updateMessageHandler(updatedMessage: FullMessage) {
            setMessages(prevMessages => prevMessages.map(message => {
                if (message.id === updatedMessage.id) {
                    return updatedMessage;
                }
                return message;
            }));
        }

        function deletedMessageHandler(deletedMessage: { id: string }) {
            console.log("deleted message", deletedMessage);
            setMessages(prevMessages => prevMessages.filter(message =>
                message.id !== deletedMessage.id
            ));
        }

        pusherClient.bind("message:new", newMessageHandler);
        pusherClient.bind("message:update", updateMessageHandler);
        pusherClient.bind("message:delete", deletedMessageHandler);


        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("message:new", newMessageHandler);
            pusherClient.unbind("message:update", updateMessageHandler);
            pusherClient.unbind("message:delete", deletedMessageHandler);
        };
    }, [ conversationId ]);

    return (
        <div className="flex-1 bg-base-200 px-2 overflow-y-auto"
             onClick={() => setMessageWithActionMenu("")}
             onScroll={() => setMessageWithActionMenu("")}
            >
            {messages.map((message, index) => (
                <MessageBox message={message} isLast={index === messages.length - 1} key={message.id}
                            messageWithActionMenu={messageWithActionMenu}
                            setMessageWithActionMenu={setMessageWithActionMenu}
                />
            ))}
            <div ref={bottomRef} className="pt-24"/>
        </div>
    )
}