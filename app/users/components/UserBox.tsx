"use client"

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import UserAvatar from "@/app/components/UserAvatar";
import { createChat } from "@/app/lib/db/conversation";

interface UserBoxProps {
    user: User,
}

export default function UserBox({ user }: UserBoxProps) {

    const router = useRouter();

    async function handleClick() {
        const chat = await createChat({ userId: user.id });
        if (chat) {
            router.push(`/conversations/${chat.id}`);
        }
    }

    return (
        <div onClick={handleClick}
             className="flex w-full items-center gap-3 px-3 py-2 cursor-pointer border-b border-neutral last:border-b-0 hover:bg-base-300">
            <UserAvatar user={user} width={40} height={40}/>
            <h4 className="text-lg font-semibold text-base-content">{user.name}</h4>
        </div>
    );
}