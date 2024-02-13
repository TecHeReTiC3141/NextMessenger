"use client"

import Link from "next/link";
import clsx from "clsx";
import { SidebarRoute } from "@/app/hooks/useRoutes";

export default function DesktopItem({ label, href, icon: Icon, active, onClick }: SidebarRoute) {

    function handleClick() {
        if (onClick) {
            return onClick();
        }
    }
    return (
        <li onClick={handleClick}>
            <Link href={href} className={clsx("flex group rounded-lg p-3 text-sm leading-6 fond-semibold hover:bg-base-200",
                active && "bg-base-200 text-black")}>
                <Icon className="w-6 h-6 shrink-0" />
                <span className="sr-only">{label}</span>
            </Link>
        </li>
    )
}