"use client"

import { ConversationInList } from "@/app/lib/db/conversation";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import UserAvatar from "@/app/components/UserAvatar";
import { FaEllipsisVertical } from "react-icons/fa6";


interface ConversationHeaderProps {
    conversation: ConversationInList,
}

export default function ConversationHeader({ conversation }: ConversationHeaderProps) {

    const otherUser = useOtherUser(conversation);
    const statusText = conversation.isGroup ? `${conversation.users.length} members` : "was recently";

    return (
        <div className="flex w-full py-2 px-4 lg:px-6 border-b border-neutral shadow-md  items-center gap-3">
            <Link href="/conversations" className="lg:hidden text-sky-500 hover:text-sky-700 transition">
                <FaArrowLeft size={32}/>
            </Link>
            <UserAvatar user={otherUser} width={36} height={36}/>
            <div className="flex-1">
                <h2 className="text-xl font-bold">{conversation.name || otherUser.name}</h2>
                <p className="text-sm">{statusText}</p>
            </div>
            <div className="rounded-full p-2 hover:bg-sky-100 cursor-pointer">
                <FaEllipsisVertical size={24} onClick={() => {}}
                                    className=" text-sky-500 hover:text-sky-600  transition"/>
            </div>
        </div>
    )
}