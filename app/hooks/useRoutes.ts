import { usePathname } from "next/navigation";
import { useMemo } from "react";
import useConversation from "@/app/hooks/useConversation";
import { HiChat } from "react-icons/hi";
import { HiUsers } from "react-icons/hi2";
import { IconType } from "react-icons";

export interface SidebarRoute {
    label: string,
    href: string,
    icon: IconType,
    active?: boolean,
    onClick?: () => {}
}

export default function useRoutes(): SidebarRoute[] {
    const pathname = usePathname();
    const { conversationId } = useConversation();

    return useMemo(() => [
        {
            label: "Chat",
            href: "/conversations",
            icon: HiChat,
            active: pathname === "/conversations" || !!conversationId,
        },
        {
            label: "Users",
            href: "/users",
            icon: HiUsers,
            active: pathname === "/users"
        },

    ], [pathname, conversationId]);
}