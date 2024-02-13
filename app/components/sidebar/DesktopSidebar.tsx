"use client"

import useRoutes from "@/app/hooks/useRoutes";
import { useState } from "react";
import DesktopItem from "@/app/components/sidebar/DesktopItem";

export default function DesktopSidebar() {
    const routes = useRoutes();
    const [ isOpened, setIsOpened ] = useState(false);

    return (
        <div className="hidden lg:fixed left-0 inset-y-0 z-40 w-20 border-r-[1px] bg-base-100 xl:px-6 overflow-y-auto pb-6 lg:flex flex-col justify-between">
            <nav className="mt-4 flex flex-col justify-between">
                <ul role="list" className="flex flex-col space-y-1 items-center">
                    {routes.map(route => (
                        <DesktopItem key={route.href} {...route} />
                    ))}
                </ul>
            </nav>
        </div>
    )
}