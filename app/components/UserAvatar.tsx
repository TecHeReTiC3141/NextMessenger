import { SessionUser } from "@/app/lib/db/user";
import Image from "next/image";
import avatarPlaceholder from "@/public/images/avatar-placeholder.jpg";
import useActiveList from "@/app/hooks/useActiveList";
import clsx from "clsx";

interface UserAvatarProps {
    user: NonNullable<SessionUser>,
    width: number,
    height: number,
}

export default function UserAvatar({user, width, height}: UserAvatarProps) {

    const { members } = useActiveList();

    const isActive = members.indexOf(user.email as string) !== -1;
    return (
        <div className={clsx("avatar relative cursor-pointer hover:opacity-75 transition-opacity duration-200", isActive ? "online" : "offline")}>
            <div style={{width, height}} className="rounded-full">

            <Image className="rounded-full object-cover" style={{width, height}}
                   src={user?.image || avatarPlaceholder} alt={user?.name || ""}
                   width={280} height={280} />
            </div>
        </div>
    )
}