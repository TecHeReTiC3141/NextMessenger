import { FullMessage } from "@/app/lib/db/message";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import UserAvatar from "@/app/components/UserAvatar";
import { User } from "@prisma/client";
import { format } from "date-fns";
import MessageImage from "@/app/conversations/[conversationId]/components/MessageImage";

interface MessageBoxProps {
    message: FullMessage,
    isLast: boolean
}

export default function MessageBox({ message, isLast }: MessageBoxProps) {

    // TODO: Open dropdown menu with actions when clicked

    const session = useSession();

    const user = session?.data?.user;

    const isOwnMessage = user?.id === message.senderId;

    const seenList = message.seen
        .filter(user => user.id !== message.senderId)
        .map(user => user.name)
        .join(", ");
    return (
        <div className={clsx("chat", isOwnMessage ? "chat-end" : "chat-start")}>
            <div className="chat-image avatar">
                <div className="h-10 w-12 rounded-full">
                    <UserAvatar user={message.sender as User} height={40} width={40}/>
                </div>
            </div>
            <div className="chat-header">
                <p className="mr-1 inline">{message.sender?.name}</p>
                <time className="text-xs opacity-50">{format(message.createdAt, "p")}</time>
            </div>
            {
                message.image && !message.body ?
                    <MessageImage image={message.image}/>
                    :
                    <div
                        className={clsx("chat-bubble", isOwnMessage ? "bg-primary" : "bg-base-300 text-base-content flex-col gap-3")}>
                        <p>{message.body}</p>
                        <MessageImage image={message.image}/>
                    </div>

            }
            {isOwnMessage && isLast && seenList.length > 0 && (
                <div className="chat-footer text-xs">
                    <p>Seen by {seenList}</p>
                </div>
            )}

        </div>
    )
}