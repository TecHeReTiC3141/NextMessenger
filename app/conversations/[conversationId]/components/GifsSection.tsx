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
        getGifs("", "featured")
            .then(res => setGifs(res))
            .catch(err => toast.error("Error while searching for gifs:", err));
        setInterval(() => setTimer(prev => prev + 1), 1);
    }, []);
    let searchTimeoutId: NodeJS.Timeout;

    function handleSearch(ev: ChangeEvent<HTMLInputElement>) {
        clearTimeout(searchTimeoutId);
        const query = ev.currentTarget.value;
        searchTimeoutId = setTimeout(async () => {
            try {

                const result = await getGifs(query, query !== "" ? "search" : "featured");
                console.log(result);
                setGifs(result);
            } catch (err: any) {
                toast.error("Error while searching for gifs:", err);
            }
        }, 400);
    }

    return (
        <div className="w-full px-2 py-1" onClick={event => event.stopPropagation()}>
            <h3 className="font-bold text-lg">Gifs</h3>
            <div className="relative my-2">
                <input type="text" className="input input-sm w-full focus:outline-none focus:border-gray-700"
                       placeholder="Search in Tenor" onChange={handleSearch}/>
                <FaMagnifyingGlass className="absolute top-1/2 -translate-y-1/2 right-1" size={20}/>
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-x-2 items-start">
                <div className="flex flex-col justify-start w-full lg:w-1/2 gap-1">

                    {gifs.slice(0, gifs.length / 2).map(url => (
                        <div key={url} className="w-full">
                            <Image src={url} alt="Gif" width={180} height={180}
                                   className="object-cover rounded-md cursor-pointer border-2 hover:border-sky-400"/>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col justify-start w-full lg:w-1/2 gap-1">
                    {gifs.slice(gifs.length / 2, gifs.length).map(url => (
                        <div key={url} className="w-full">
                            <Image src={url} alt="Gif" width={180} height={180}
                                   className="object-cover rounded-md cursor-pointer border-2 hover:border-sky-400"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}