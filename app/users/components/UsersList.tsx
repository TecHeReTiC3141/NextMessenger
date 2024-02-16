import { User } from "@prisma/client";
import UserBox from "@/app/users/components/UserBox";

interface UsersListProps {
    items: User[],
}

export default function UsersList({ items }: UsersListProps) {
    return (
        <aside
            className="fixed inset-y-0 w-full block pb-20 lg:w-80 lg:pb-0 lg:left-20 border-r border-base-300 left-0">
            <div>
                <div className="flex-col px-3">
                    <div className="text-2xl font-bold py-2">
                        People
                    </div>
                </div>

                {items.map(user => (
                    <UserBox key={user.id} user={user}/>
                ))}
            </div>
        </aside>
    );

}