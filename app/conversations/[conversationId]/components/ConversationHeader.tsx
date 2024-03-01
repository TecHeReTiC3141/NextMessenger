"use client"

import { ConversationInList } from "@/app/lib/db/conversation";
import useOtherUser from "@/app/hooks/useOtherUser";
import Link from "next/link";
import { FaArrowLeft, FaEllipsisVertical, FaRegTrashCan } from "react-icons/fa6";
import UserAvatar from "@/app/components/UserAvatar";
import ProfileDrawer from "@/app/conversations/[conversationId]/components/ProfileDrawer";
import ConfirmDeleteModal from "@/app/conversations/[conversationId]/components/ConfirmDeleteModal";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";
import { openModal } from "@/app/components/Modal";


interface ConversationHeaderProps {
    conversation: ConversationInList,
}

export default function ConversationHeader({ conversation }: ConversationHeaderProps) {

    const { members } = useActiveList();

    const otherUser = useOtherUser(conversation);
    const statusText = conversation.isGroup ? `${conversation.users.length} members` :
        (members.indexOf(otherUser.email as string) !== -1 ? "Active" : "was recently");


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
                        {conversation.isGroup ?
                            <AvatarGroup users={conversation.users}/> :
                            <UserAvatar user={otherUser} width={36} height={36}/>
                        }
                        <label htmlFor="profile-drawer-toggle"
                               className=" cursor-pointer flex-1 flex justify-between items-center">
                            <div className="">
                                <h2 className="text-xl font-bold">{conversation.name || otherUser.name}</h2>
                                <p className="text-sm">{statusText}</p>
                            </div>
                            <div className="dropdown dropdown-bottom dropdown-end" onClick={ev => ev.preventDefault()}>
                                <div tabIndex={0} role="button"
                                     className="bg-transparent m-1 p-2 hover:bg-sky-100 rounded-full">
                                    <FaEllipsisVertical size={24}
                                                        className=" text-sky-500 hover:text-sky-600  transition"/></div>
                                <ul tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 gap-2">
                                    <li className="w-full  group">
                                        <button className="w-full justify-start btn btn-ghost"
                                                onClick={() => openModal("delete-conversation")}>
                                            <span className="rounded-full p-2 group-hover:bg-error">
                                                <FaRegTrashCan className="text-lg "/>
                                            </span>
                                            <span
                                                className="group-hover:font-bold p-1 rounded-lg text-sm">Delete?</span>
                                        </button>

                                    </li>
                                </ul>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="drawer-side z-50">
                    <label htmlFor="profile-drawer-toggle" aria-label="close sidebar"
                           className="drawer-overlay"></label>
                    <ProfileDrawer conversation={conversation}/>
                </div>
            </div>
            <ConfirmDeleteModal/>
        </>

    )
}