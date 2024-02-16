"use client"

import useRoutes from "@/app/hooks/useRoutes";
import { useState } from "react";
import DesktopItem from "@/app/components/sidebar/DesktopItem";
import {SessionUser} from "@/app/lib/db/user";
import UserAvatar from "@/app/components/UserAvatar";

interface DesktopSidebarProps {
    user: NonNullable<SessionUser>,
}

export default function DesktopSidebar({user}: DesktopSidebarProps) {
    const routes = useRoutes();
    const [ isOpened, setIsOpened ] = useState(false);

    return (
        <div className="hidden lg:fixed left-0 inset-y-0 z-40 w-20 border-r-[1px] bg-base-100 xl:px-3
                overflow-y-auto overflow-x-hidden pb-6 lg:flex flex-col items-center justify-between">
            <nav className="mt-4 flex flex-col justify-between">
                <ul role="list" className="flex flex-col space-y-1 items-center">
                    {routes.map(route => (
                        <DesktopItem key={route.href} {...route} />
                    ))}
                </ul>
            </nav>
            <UserAvatar user={user} width={40} height={40} />

        </div>
    )
}