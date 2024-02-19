"use client"

import { ConversationInList } from "@/app/lib/db/conversation";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import UserAvatar from "@/app/components/UserAvatar";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useState } from "react";
import ProfileDrawer from "@/app/conversations/[conversationId]/components/ProfileDrawer";
import Modal from "@/app/components/Modal";


interface ConversationHeaderProps {
    conversation: ConversationInList,
}

export default function ConversationHeader({ conversation }: ConversationHeaderProps) {

    const otherUser = useOtherUser(conversation);
    const statusText = conversation.isGroup ? `${conversation.users.length} members` : "was recently";


    return (
        <>
            <div className="drawer drawer-end">
                <input id="profile-drawer-toggle" type="checkbox" className="drawer-toggle"/>
                <div className="drawer-content">

                    <div
                        className="flex w-full py-2 px-4 lg:px-6 border-b border-neutral shadow-md  items-center gap-3">
                        <Link href="/conversations" className="lg:hidden text-sky-500 hover:text-sky-700 transition">
                            <FaArrowLeft size={32}/>
                        </Link>
                        <UserAvatar user={otherUser} width={36} height={36}/>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold">{conversation.name || otherUser.name}</h2>
                            <p className="text-sm">{statusText}</p>
                        </div>
                        <label htmlFor="profile-drawer-toggle"
                               className="rounded-full p-2 hover:bg-sky-100 cursor-pointer">
                            <FaEllipsisVertical size={24}
                                                className=" text-sky-500 hover:text-sky-600  transition"/>
                        </label>
                    </div>
                </div>
                <div className="drawer-side z-50">
                    <label htmlFor="profile-drawer-toggle" aria-label="close sidebar"
                           className="drawer-overlay"></label>
                    <ProfileDrawer conversation={conversation}/>
                </div>
            </div>
            <Modal id="delete-conversation">
                <div>
                    <h2>Are you sure to delete conversation? This action can not be undone</h2>
                    <div className="modal-action  mt-4">
                        <form method="dialog">
                            <button className="btn btn-sm rounded-lg btn-ghost mr-2">Cancel</button>
                            <button className="btn btn-sm rounded-lg btn-error">Delete</button>
                        </form>
                    </div>
                </div>
            </Modal>
        </>

    )
}