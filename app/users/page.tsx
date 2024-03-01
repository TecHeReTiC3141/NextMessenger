import EmptyState from "@/app/components/EmptyState";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Users",
}

export default function UsersPage() {
    return (
        <div className="hidden lg:flex w-full h-full">
            <EmptyState />
        </div>
    )
}