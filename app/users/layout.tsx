import React from "react";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { getOtherUsers } from "@/app/lib/db/user";
import UsersList from "@/app/users/components/UsersList";

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
    const users = await getOtherUsers();

    return (
        <Sidebar>
            <div className="h-full">
                <UsersList items={users}/>
                {children}
            </div>
        </Sidebar>
    )
}