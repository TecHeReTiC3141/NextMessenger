import { FullConversation } from "@/app/lib/db/conversation";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export default function useOtherUser(conversation: FullConversation) {

    const session = useSession();
    const otherUsers = useMemo(() => {
        return conversation.users.filter(user => user.id !== session?.data?.user?.id)[0];

    }, [ session?.data?.user?.id, conversation ]);

    return otherUsers;

}