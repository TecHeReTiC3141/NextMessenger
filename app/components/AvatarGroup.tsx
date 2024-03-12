import { User } from "@prisma/client";
import Image from "next/image";
import avatarPlaceholder from "@/public/images/avatar-placeholder.jpg"
import clsx from "clsx";

interface AvatarGroupProps {
    users: User[],
    type: "slim" | "full"
}

export default function AvatarGroup({ users, type }: AvatarGroupProps) {

    const visibleUsers = users.slice(0, 3);

    const userStyles = {
        0: "bottom-0 left-1/2 -translate-x-[50%]",
        1: "top-0 left-0",
        2: "top-0 right-0",
    }
    return (
        <div className={clsx(type === "slim" ? "w-10 h-full" : "avatar-group -space-x-6 rtl:space-x-reverse")}>
            {type === "slim" ?
                <>
                    {
                        visibleUsers.map((user, index) => (
                            <div key={user.id} className="relative">
                                <Image width={280} height={280} alt={user.name || ""}
                                       src={user.image || avatarPlaceholder}
                                       className={clsx("w-5 h-5 absolute avatar object-cover rounded-full", userStyles[ index as keyof typeof userStyles ])}/>
                            </div>
                        ))
                    }
                </> :
                <>
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
                </>
            }
        </div>
    )
}
