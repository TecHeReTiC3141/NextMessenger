"use client"

import useConversation from "@/app/hooks/useConversation";
import EmptyState from "@/app/components/EmptyState";
import clsx from "clsx";

export default function ConversationsPage() {

    const { isOpen } = useConversation();
    return (
        <div className={clsx("h-full lg:block",
            isOpen ? "block" : "hidden")}>
            <EmptyState />
        </div>
    )
}