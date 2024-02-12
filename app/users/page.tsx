import { signOut } from "next-auth/react";
import EmptyState from "@/app/components/EmptyState";

export default function UsersPage() {
    return (
        <div className="hidden lg:flex w-full h-full">
            <EmptyState />
        </div>
    )
}