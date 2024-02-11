"use client"

import { signOut } from "next-auth/react";

export default function Users() {
    return (
        <button onClick={() => signOut({ callbackUrl: "/"})}>Hello, user!</button>
    )
}