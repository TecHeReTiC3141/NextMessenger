"use client"

import { User } from "@prisma/client";
import UserBox from "@/app/users/components/UserBox";
import { ChangeEvent, useMemo, useState } from "react";
import Fuse, { IFuseOptions } from "fuse.js";

interface UsersListProps {
    initialItems: User[],
}

const fuseOptions: IFuseOptions<User> = {
    keys: [
        "name",
    ]
}

export default function UsersList({ initialItems }: UsersListProps) {
    const [ items, setItems ] = useState(initialItems);
    const fuse = useMemo(() => new Fuse(initialItems, fuseOptions), [initialItems]);

    function handleUserSearch(ev: ChangeEvent<HTMLInputElement>) {
        const userSearchInput = ev.currentTarget as HTMLInputElement;
        console.log(userSearchInput.value);
        setItems(!userSearchInput.value ? initialItems :
            fuse.search(userSearchInput.value).map(res => res.item));
    }

    return (
        <aside
            className="fixed inset-y-0 w-full block pb-20 lg:w-80 lg:pb-0 lg:left-20 border-r border-base-300 left-0">
            <div>
                <div className="flex px-3 items-center gap-2">
                    <div className="text-2xl font-bold py-2">
                        People
                    </div>
                    <label
                        className="input input-sm flex items-center py-3 gap-3 lg:flex-1 max-w-sm border-none">
                        <input type="text" placeholder="Search users..." className="lg:max-w-40 flex-grow border-none" onChange={handleUserSearch}/>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                             className="w-4 h-4 opacity-70">
                            <path fillRule="evenodd"
                                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </label>
                </div>

                {items.map(user => (
                    <UserBox key={user.id} user={user}/>
                ))}
            </div>
        </aside>
    );

}