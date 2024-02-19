import { ConversationInList } from "@/app/lib/db/conversation";
import useOtherUser from "@/app/hooks/useOtherUser";
import { format } from "date-fns";
import { IoClose } from "react-icons/io5";
import UserAvatar from "@/app/components/UserAvatar";
import { FaRegTrashCan } from "react-icons/fa6";

interface ProfileModalProps {
    conversation: ConversationInList
}

export default function ProfileDrawer({ conversation }: ProfileModalProps) {

    const otherUser = useOtherUser(conversation);

    const joinedDate = format(otherUser.createdAt, "PP");

    const title = conversation.name || otherUser.name;

    const statusText = conversation.isGroup ? `${conversation.users.length} members` : "Active";

    return (
        <div className="relative min-w-96 h-full bg-white px-8">
            <div className="absolute inset-x-0 top-0 bg-neutral h-12">
                <label htmlFor="profile-drawer-toggle" aria-label="close sidebar"
                       className="absolute top-2 right-2 text-error cursor-pointer btn btn-ghost hover:bg-transparent btn-xs">
                    <IoClose size={24}/>
                    <span className="sr-only">Close drawer</span>
                </label>
            </div>
            <div className="flex flex-col items-center gap-1 mt-14">
                <UserAvatar user={otherUser} width={60} height={60}/>
                <h4 className="text-lg">{title}</h4>
                <p className="text-sm">{statusText}</p>

                <div className="group flex flex-col items-center">
                    <button className="btn btn-circle btn-error btn-ghost btn-sm hover:bg-error">
                        <FaRegTrashCan/>
                    </button>
                    <p className="group-hover:font-bold p-1 rounded-lg text-sm">Delete?</p>
                </div>
            </div>
            <div>
                <p className="font-bold text-lg">Email:</p>
                <p>{otherUser.email}</p>
            <div className="divider my-1"></div>
            </div>
            <div>
                <p className="font-bold text-lg">Joined:</p>
                <p>{joinedDate}</p>
            </div>
        </div>
    )
}