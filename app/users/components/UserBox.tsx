"use client"

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import UserAvatar from "@/app/components/UserAvatar";

interface UserBoxProps {
    user: User,
}

export default function UserBox({ user }: UserBoxProps) {

    const router = useRouter();

    return (
        <div className="flex w-full items-center gap-3 px-3 cursor-pointer border-b-2 border-neutral last:border-b-0 hover:bg-base-300">
            <UserAvatar user={user} width={40} height={40}/>
            <div className="flex-1">
                <h4 className="text-lg font-semibold text-base-content">{user.name}</h4>
                <p>Hello, bro</p>
            </div>
        </div>
    );
}