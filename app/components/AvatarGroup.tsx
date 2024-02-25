import { User } from "@prisma/client";
import Image from "next/image";
import avatarPlaceholder from "@/public/images/avatar-placeholder.jpg"

interface AvatarGroupProps {
    users: User[],
}

export default function AvatarGroup({ users }: AvatarGroupProps) {

    const visibleUsers = users.slice(0, 3);
    return (
        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
            {visibleUsers.map(user => (
                <div key={user.id} className="avatar">
                    <div className="w-10">
                        <Image fill alt={user.name || ""} src={user.image || avatarPlaceholder}/>
                    </div>
                </div>
            ))}
            {users.length > 3 &&
                <div className="avatar placeholder">
                    <div className="w-10 bg-neutral text-neutral-content">
                        <span>+{users.length - 3}</span>
                    </div>
                </div>
            }
        </div>
    )
}