import React from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import ConversationsList from "@/app/conversations/components/ConversationsList";
import { getUserConversations } from "@/app/lib/db/conversation";
import { useSession } from "next-auth/react";

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {

    const conversations = await getUserConversations();

    return (
        <Sidebar>
            <div className="h-full">
                <ConversationsList initialItems={conversations} />
                {children}
            </div>
        </Sidebar>
    )
}