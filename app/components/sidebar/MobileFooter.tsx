"use client"

import useRoutes from "@/app/hooks/useRoutes";
import useConversation from "@/app/hooks/useConversation";
import MobileItem from "@/app/components/sidebar/MobileItem";
import { SessionUser } from "@/app/lib/db/user";
import { FaCircleUser } from "react-icons/fa6";
import { openModal } from "@/app/components/Modal";


interface MobileFooterProps {
    user: NonNullable<SessionUser>,
}


export default function MobileFooter({user}: MobileFooterProps) {
    const routes = useRoutes();
    const { isOpen } = useConversation();

    if (isOpen) {
        return <div></div>;
    }
    return (
        <div className="fixed bottom-0 flex justify-between w-full z-40 items-center border-t-[1px] lg:hidden">
            {routes.map(route => (
                <MobileItem key={route.href} {...route}/>
            ))}
            <MobileItem label="Profile settings" href="#" icon={FaCircleUser} onClick={() => openModal("settings-modal")} />
        </div>
    );
}