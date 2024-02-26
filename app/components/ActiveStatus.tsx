"use client"

import useActiveChannel from "@/app/hooks/useActiveChannel";

export default function ActiveStatus() {
    useActiveChannel();

    return null;
}