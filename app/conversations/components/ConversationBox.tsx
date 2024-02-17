import UserAvatar from "@/app/components/UserAvatar";
import { ConversationInList } from "@/app/lib/db/conversation";
import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import useOtherUser from "@/app/hooks/useOtherUser";

interface ConversationBoxProps {
    conversation: ConversationInList,
    selected: boolean,
}

export default function ConversationBox({ conversation, selected }: ConversationBoxProps) {

    const session = useSession();

    const userEmail = session?.data?.user?.email;

    const otherUser = useOtherUser(conversation);

    const lastMessage = useMemo(() => {
            const messages = conversation.messages || [];
            return messages.at(-1);
        },
        [ conversation.messages ]);
    const seenLastMessage = useMemo(() => {
        if (!userEmail || !lastMessage) {
            return false;
        }

        const seen = lastMessage.seen || [];
        return seen.filter(user => user.email === userEmail).length > 0;
    }, [lastMessage, userEmail]);
    return (
        <>
            {conversation.isGroup ?
                <Link href={`/conversations/${conversation.id}`}
                      className="flex w-full items-center gap-3 px-3 cursor-pointer border-b-2 border-neutral last:border-b-0 hover:bg-base-300">
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-base-content">{conversation.name}</h4>
                        <p>{lastMessage ? lastMessage.body : "Start chat"}</p>
                    </div>
                </Link>
                :
                <Link href={`/conversations/${conversation.id}`}
                      className="flex w-full items-center gap-3 px-3 cursor-pointer border-b-2 border-neutral last:border-b-0 hover:bg-base-300">
                    <UserAvatar user={otherUser} width={40} height={40}/>
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-base-content">{otherUser.name}</h4>
                        <p>{lastMessage ? lastMessage.body : "Start chat"}</p>
                    </div>
                </Link>
            }
        </>
    );
}