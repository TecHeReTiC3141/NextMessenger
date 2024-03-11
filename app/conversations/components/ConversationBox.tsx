import UserAvatar from "@/app/components/UserAvatar";
import { ConversationInList } from "@/app/lib/db/conversation";
import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import useOtherUser from "@/app/hooks/useOtherUser";
import clsx from "clsx";
import { format } from "date-fns";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
    conversation: ConversationInList,
    selected: boolean,
}

export default function ConversationBox({ conversation, selected }: ConversationBoxProps) {

    // TODO: add counter of unread messages

    const session = useSession();

    const userId = session?.data?.user?.id;

    const otherUser = useOtherUser(conversation);

    const lastMessage = (conversation.messages || []).at(-1);

    if (conversation.unreadMessages.length > 0) {
        console.log(conversation.name, conversation.unreadMessages);
    }

    const seenLastMessage = useMemo(() => {
        if (!userId || !lastMessage) {
            return false;
        }

        const seen = lastMessage.seen || [];
        return seen.filter(user => user.id === userId).length > 0;
    }, [ lastMessage, userId ]);
    
    const unreadMessagesCount = useMemo(() => {
        return conversation.unreadMessages[0]?.value || 0;
    }, [conversation.unreadMessages])

    const lastMessageText = lastMessage ? (lastMessage?.image ? "Sent an image" : lastMessage?.body) : "Start a new chat";

    return (
        <>
            <Link href={`/conversations/${conversation.id}`}
                  className={
                      clsx("flex relative w-full items-center gap-3 px-3 cursor-pointer border-b border-neutral last:border-b-0 truncate hover:bg-base-300",
                          selected && "bg-base-300")}>
                {conversation.isGroup ?
                    <>
                        <AvatarGroup users={conversation.users}/>
                        <div className="flex-1  max-w-4/5 w-4/5">
                            <h4 className="text-lg font-semibold text-base-content">{conversation.name}</h4>
                            <p className={clsx("truncate text-sm max-w-full",
                                seenLastMessage ? "text-gray-500" : "text-black font-medium")}>{lastMessageText}</p>
                        </div>
                    </> :
                    <>
                        <UserAvatar user={otherUser} width={40} height={40}/>
                        <div className="flex-1 max-w-4/5 w-4/5">
                            <h4 className="text-lg font-semibold text-base-content">{otherUser.name}</h4>
                            <p className={clsx("truncate text-sm max-w-full",
                                seenLastMessage ? "text-gray-500" : "text-black font-medium")}>{lastMessageText}</p>
                        </div>
                    </>
                }
                <p className="absolute top-2 right-2 text-sm">
                    {lastMessage && format(new Date(lastMessage.createdAt), "p")}
                </p>

                <div className="absolute bottom-0.5 right-2 text-sm w-5 h-5 bg-primary text-primary-content text-center rounded-full">
                    {unreadMessagesCount}
                </div>

            </Link>
        </>
    );
}