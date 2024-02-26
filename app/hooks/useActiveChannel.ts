"use client"

import useActiveList from "@/app/hooks/useActiveList";
import { pusherClient } from "@/app/lib/pusher";
import { useEffect, useState } from "react";
import { Channel, Members } from "pusher-js";

export default function useActiveChannel() {
    const { set, add, remove } = useActiveList();

    const [ activeChannel, setActiveChannel ] = useState<Channel | null>(null);

    useEffect(() => {
        let channel = activeChannel;

        if (!channel) {
            channel = pusherClient.subscribe("presence-messenger");
            setActiveChannel(channel);
        }

        channel.bind("pusher:subscription_succeeded", (members: Members) => {
            const initialMembers: string[] = [];
            console.log("subscription_succeeded");
            members.each((member: Record<string, any>) => initialMembers.push(member.id))
            set(initialMembers);
        });

        channel.bind("pusher:member_added", (member: Record<string, any>) => {
            add(member.id);
        });

        channel.bind("pusher:member_removed", (member: Record<string, any>) => {
            remove(member.id);
        });

        return () => {
            if (activeChannel) {
                pusherClient.unsubscribe("presence-channel");
                setActiveChannel(null);
            }
        }


    }, [activeChannel, add, remove, set]);
}