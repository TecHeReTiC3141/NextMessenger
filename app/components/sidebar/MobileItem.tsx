import { SidebarRoute } from "@/app/hooks/useRoutes";
import Link from "next/link";
import clsx from "clsx";

export default function MobileItem({ active, label, href, onClick, icon: Icon }: SidebarRoute) {
    function handleClick() {
        if (onClick) {
            return onClick();
        }
    }

    return (
        <Link onClick={handleClick} href={href} className={
            clsx("flex justify-center flex-1 gap-x-3 group rounded-lg p-4 text-sm leading-6 fond-semibold hover:bg-base-200",
                active && "bg-base-200 text-black")}>
            <Icon className="w-6 h-6 shrink-0"/>
            <span className="sr-only">{label}</span>
        </Link>
    )
}