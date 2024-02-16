import {SessionUser} from "@/app/lib/db/user";
import Image from "next/image";
import {FaUser} from "react-icons/fa6";
import avatarPlaceholder from "@/public/images/avatar-placeholder.jpg";

interface UserAvatarProps {
    user: SessionUser,
    width: number,
    height: number,
}

export default function UserAvatar({user, width, height}: UserAvatarProps) {
    return (
        <div className="avatar online">
            <div style={{width, height}} className="rounded-full">

            <Image className="rounded-full object-cover"
                   src={user?.image || avatarPlaceholder} alt={user?.name || ""}
                   fill />
            </div>
        </div>
    )
}