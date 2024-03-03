import { FullMessage } from "@/app/lib/db/message";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import UserAvatar from "@/app/components/UserAvatar";
import { User } from "@prisma/client";
import { format } from "date-fns";
import MessageImage from "@/app/conversations/[conversationId]/components/message/MessageImage";
import { Dispatch, SetStateAction, useState } from "react";
import { IoArrowUndoOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiEdit3 } from "react-icons/fi";
import ConfirmMessageDeleteModal
    from "@/app/conversations/[conversationId]/components/message/ConfirmMessageDeleteModal";
import { openModal } from "@/app/components/Modal";

interface MessageBoxProps {
    message: FullMessage,
    isLast: boolean,
    messageWithActionMenu: string,
    setMessageWithActionMenu: Dispatch<SetStateAction<string>>
}

export default function MessageBox({
                                       message,
                                       isLast,
                                       messageWithActionMenu,
                                       setMessageWithActionMenu
                                   }: MessageBoxProps) {

    // TODO: Open dropdown menu with actions when clicked
    // TODO: Implement answering to certain message

    const [ isContextMenuVisible, setContextMenuVisible ] = useState(false);
    const [ contextMenuPosition, setContextMenuPosition ] = useState({ x: 0, y: 0 });

    const handleAction1Click = () => {
        // Handle action 1 click
        setContextMenuVisible(false);
    };

    const handleAction2Click = () => {
        // Handle action 2 click
        setContextMenuVisible(false);
    };

    const session = useSession();

    const user = session?.data?.user;

    const isOwnMessage = user?.id === message.senderId;

    const seenList = message.seen
        .filter(user => user.id !== message.senderId)
        .map(user => user.name)
        .join(", ");
    return (
        <>
            <ConfirmMessageDeleteModal message={message} />
            <div className={clsx("chat", isOwnMessage ? "chat-end" : "chat-start")}>
                <div className="chat-image avatar">
                    <div className="h-10 w-12 rounded-full">
                        <UserAvatar user={message.sender as User} height={40} width={40}/>
                    </div>
                </div>
                <div className="chat-header">
                    <p className="mr-1 inline">{message.sender?.name}</p>
                    <time className="text-xs opacity-50">{format(message.createdAt, "p")}</time>
                </div>
                <div onContextMenu={(event) => {
                    event.preventDefault();
                    setContextMenuPosition({ x: event.clientX, y: event.clientY });
                    setMessageWithActionMenu(message.id);
                    setContextMenuVisible(true);
                }}
                     className={clsx(message.body && "chat-bubble", !message.body ? "bg-transparent" :
                         (isOwnMessage ? "bg-primary" : "bg-base-300 text-base-content flex-col gap-3"))}>
                    {
                        message.image && !message.body ?
                            <MessageImage image={message.image}/>
                            :
                            <>
                                <p>{message.body}</p>
                                <MessageImage image={message.image}/>
                            </>
                    }
                </div>
                {isOwnMessage && isLast && seenList.length > 0 && (
                    <div className="chat-footer text-xs">
                        <p>Seen by {seenList}</p>
                    </div>
                )}

            </div>
            {
                isContextMenuVisible && messageWithActionMenu === message.id && (
                    <ul className="menu bg-base-200 w-56 rounded-box absolute z-[1] -translate-x-[100%] border-neutral border"
                        style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}>
                        <li>
                            <div>
                                <IoArrowUndoOutline/>
                                <p>Answer</p>
                            </div>
                        </li>
                        {
                            user?.id === message.senderId && (
                                <>
                                    <li>
                                        <div>
                                            <FiEdit3/>
                                            <p>Edit</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div onClick={() => openModal(`delete-message-${message.id}`)}>
                                            <FaRegTrashCan/>
                                            <p>Delete</p>
                                        </div>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                )
            }
        </>
    )
}