import React from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import ConversationsList from "@/app/conversations/components/ConversationsList";
import { getUserConversations } from "@/app/lib/db/conversation";
import { getOtherUsers } from "@/app/lib/db/user";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conversations",
}

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {

    const conversations = await getUserConversations();
    const otherUsers = await getOtherUsers();

    return (
        <Sidebar>
            <div className="h-full">
                <ConversationsList initialItems={conversations} otherUsers={otherUsers}/>
                {children}
            </div>
        </Sidebar>
    )
}