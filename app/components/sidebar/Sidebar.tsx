import DesktopSidebar from "@/app/components/sidebar/DesktopSidebar";
import MobileFooter from "@/app/components/sidebar/MobileFooter";

export default async function Sidebar({children}: {children: React.ReactNode}) {
    return (
        <div className="h-full">
            <DesktopSidebar />
            <MobileFooter />
            <main className="h-full lg:pl-20">
                {children}
            </main>
        </div>
    )
}