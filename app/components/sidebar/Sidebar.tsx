import DesktopSidebar from "@/app/components/sidebar/DesktopSidebar";
import MobileFooter from "@/app/components/sidebar/MobileFooter";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/lib/config/authOptions";

export default async function Sidebar({children}: {children: React.ReactNode}) {

    const session = await getServerSession(authOptions) as Session;


    return (
        <div className="h-full">
            <DesktopSidebar user={session.user} />
            <MobileFooter  user={session.user} />
            <main className="h-full lg:pl-20">
                {children}
            </main>
        </div>
    )
}