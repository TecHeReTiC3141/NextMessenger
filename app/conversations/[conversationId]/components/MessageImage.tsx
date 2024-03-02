"use client"

import ImageModal from "@/app/conversations/[conversationId]/components/ImageModal";
import { openModal } from "@/app/components/Modal";
import Image from "next/image";


interface MessageImageProps {
    image: string | null,
}

export default function MessageImage({ image }: MessageImageProps) {
    if (!image) {
        return <div></div>;
    }
    return (
        <>
            <ImageModal src={image}/>
            <button className="overflow-hidden" onClick={() => openModal(`image-modal-${image}`)}>
                <Image src={image} alt="Message image" width={288} height={288}
                       className="object-cover rounded-md cursor-pointer hover:scale-110 transition"/>
            </button>
        </>
    );
}