import { ConversationInList } from "@/app/lib/db/conversation";
import useOtherUser from "@/app/hooks/useOtherUser";
import { format } from "date-fns";

interface ProfileModalProps {
    conversation: ConversationInList
}

export default function ProfileDrawer({ conversation }: ProfileModalProps) {

    const otherUser = useOtherUser(conversation);

    const joinedDate = format(otherUser.createdAt, "PP");

    const title = conversation.name || otherUser.name;

    const statusText = conversation.isGroup ? `${conversation.users.length} members` : "Active";

    return (
        <div className="min-w-96 h-full bg-white">
            <h3>{title}</h3>

        </div>
    )
}