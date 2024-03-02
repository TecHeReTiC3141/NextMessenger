"use client"

import useRoutes from "@/app/hooks/useRoutes";
import { useState } from "react";
import DesktopItem from "@/app/components/sidebar/DesktopItem";
import { SessionUser } from "@/app/lib/db/user";
import UserAvatar from "@/app/components/UserAvatar";
import SettingsModal from "@/app/components/sidebar/SettingsModal";
import { openModal } from "@/app/components/Modal";
import logo from "@/public/images/logo.png";
import Image from "next/image";

interface DesktopSidebarProps {
    user: NonNullable<SessionUser>,
}

export default function DesktopSidebar({ user }: DesktopSidebarProps) {
    const routes = useRoutes();
    const [ isOpened, setIsOpened ] = useState(false);

    return (
        <>
            <SettingsModal user={user}/>
            <div className="hidden lg:fixed left-0 inset-y-0 z-40 w-20 border-r-[1px] bg-base-100 xl:px-3
                overflow-y-auto overflow-x-hidden pb-6 lg:flex flex-col items-center justify-between">
                <nav className="mt-4 flex flex-col justify-between">
                    <ul role="list" className="flex flex-col space-y-1 items-center">
                        {routes.map(route => (
                            <DesktopItem key={route.href} {...route} />
                        ))}
                    </ul>
                </nav>
                <div className="-rotate-90 flex gap-4 items-center select-none">
                    <Image src={logo} alt="Logo" width={40} height={40}/>
                    <h3 className="uppercase select-none text-nowrap text-3xl text-sky-500 font-bold drop-shadow-lg">
                        Next Messenger</h3>
                </div>
                <button onClick={() => openModal("settings-modal")}>
                    <UserAvatar user={user} width={40} height={40}/>
                </button>
            </div>
        </>
    )
}