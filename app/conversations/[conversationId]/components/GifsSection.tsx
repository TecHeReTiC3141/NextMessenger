"use client"

import { FaMagnifyingGlass } from "react-icons/fa6";
import { ChangeEvent, useEffect, useState } from "react";
import { getGifs } from "@/app/conversations/[conversationId]/actions";
import Image from "next/image";
import toast from "react-hot-toast";

export default function GifsSection() {

    const [ gifs, setGifs ] = useState<string[]>([]);
    const [ timer, setTimer ] = useState<number>(0);

    useEffect(() => {
        setInterval(() => setTimer(prev => prev + 1), 1);
    }, []);

    async function handleSearch(ev: ChangeEvent<HTMLInputElement>) {
        if (timer <= 500) {
            return;
        }
        setTimer(0);
        const query = ev.currentTarget.value;
        if (query) {
            try {

                const result = await getGifs(query, "search");
                console.log(result);
                setGifs(result);
            } catch (err: any) {
                toast.error("Error while searching for gifs:", err);
            }
        }
    }

    return (
        <div className="w-full px-2 py-1">
            <h3 className="font-bold text-lg">Gifs</h3>
            <div className="relative my-2">
                <input type="text" className="input input-sm w-full focus:outline-none focus:border-gray-700"
                       placeholder="Search in Tenor" onChange={handleSearch}/>
                <FaMagnifyingGlass className="absolute top-1/2 -translate-y-1/2 right-1" size={20}/>
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-2">
                {gifs.map(url => (
                    <Image src={url} key={url} alt="Gif" width={180} height={180} className="object-cover rounded-md cursor-pointer border-2 hover:border-sky-400"/>
                ))}
            </div>
        </div>
    )
}