"use client"

import useConversation from "@/app/hooks/useConversation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddMessageFormSchema } from "@/app/lib/schema";
import { z } from "zod";
import { MdOutlineGifBox, MdPhoto } from "react-icons/md";
import { HiPaperAirplane } from "react-icons/hi2";
import { handleMessageFormSubmit } from "@/app/conversations/[conversationId]/actions";
import toast from "react-hot-toast";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { FaXmark } from "react-icons/fa6";
import { Message } from ".prisma/client";
import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiEdit3 } from "react-icons/fi";
import { MessageWithSender } from "@/app/lib/db/message";
import { IoArrowUndoOutline } from "react-icons/io5";
import GifsSection from "@/app/conversations/[conversationId]/components/GifsSection";


type formFields = z.infer<typeof AddMessageFormSchema>;

interface AddNewMessageFormProps {
    editedMessage: Message | null,
    answeringMessage: MessageWithSender | null
}

export default function MessageForm({ editedMessage, answeringMessage }: AddNewMessageFormProps) {

    const { conversationId } = useConversation();

    // TODO: add Tenor client for gifs

    const pathname = usePathname(), searchParams = useSearchParams();

    const { replace } = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isLoading },
        setValue,

    } = useForm<formFields>({
        resolver: zodResolver(AddMessageFormSchema),
        defaultValues: {
            message: editedMessage?.body || "",
            image: "",
        }
    });

    useEffect(() => {
        if (editedMessage) {
            setValue("message", editedMessage.body as string);
            setValue("image", editedMessage.image as string);
        }
    }, [ editedMessage, setValue ]);

    // useEffect(() => {
    //     document.addEventListener("click", () => {
    //         const gifSection = document.querySelector("#gif-section") as HTMLDivElement;
    //         console.log("in effeft", gifSection);
    //         gifSection.classList.remove("open");
    //     })
    // }, []);

    const watchImage = watch("image");
    const watchMessage = watch("message");

    const onSubmit: SubmitHandler<formFields> = async (data) => {
        console.log(data);
        try {
            await handleMessageFormSubmit(data as unknown as FormData, editedMessage?.id, answeringMessage?.id);
        } catch (err: any) {
            toast.error(`Something went wrong while sending your message: ${err}`);
            return;
        }
        if (editedMessage || answeringMessage) {
            handleCloseEdit();
        }
        reset();
    }

    async function onUpload(result: any) {
        setValue("image", result?.info?.secure_url || "");
    }

    function handleCloseEdit() {
        const searchParamsWithoutEdit = new URLSearchParams(searchParams);
        searchParamsWithoutEdit.delete("edited");
        searchParamsWithoutEdit.delete("answering");
        replace(`${pathname}?${searchParamsWithoutEdit.toString()}`);
        setValue("message", "");
        setValue("image", "");
    }

    return (
        <div className="w-full relative">

            {editedMessage && (
                <div
                    className="absolute w-full bottom-full left-0 px-2 py-1 bg-base-300 flex items-center z-10 gap-3">
                    <FiEdit3 className="text-sky-500" size={24}/>
                    <div className="flex-1">
                        <p className="text-sm text-sky-500">Editing...</p>
                        {editedMessage.body}
                    </div>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={handleCloseEdit}>✕</button>

                </div>
            )}
            {answeringMessage && (
                <div
                    className="absolute w-full bottom-full left-0 px-2 py-1 bg-base-300 flex items-center z-10 gap-3">
                    <IoArrowUndoOutline className="text-sky-500" size={24}/>
                    <div className="flex-1">
                        <p className="text-sm text-sky-500">Answering <span
                            className="font-bold">{answeringMessage.sender?.name || ""}</span></p>
                        {answeringMessage.body}
                    </div>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={handleCloseEdit}>✕</button>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={ev => {
                if (ev.key === "Enter") {
                    ev.preventDefault();
                    const form = ev.currentTarget as HTMLFormElement;
                    console.log("submitted");
                    handleSubmit(onSubmit)();
                }
            }} className="flex gap-2 items-center border-t border-neutral px-2 py-4">
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={onUpload}
                    uploadPreset="uupnbab6"
                >
                    <MdPhoto className="text-sky-500" size={28}/>
                </CldUploadButton>
                <input type="hidden" value={conversationId} {...register("conversationId")}/>
                <input type="text" className="hidden" {...register("image")}/>
                <div className="flex-1 relative">

                    <input type="text"
                           className="w-full input input-sm focus:outline-none rounded-full bg-base-200 relative"
                           id="message-form-body"
                           placeholder="Write a message..." {...register("message")}
                           autoFocus={editedMessage !== null}/>
                    <div className="group absolute top-0 right-1 w-6 h-full" id="gif-section">
                        <div className="hidden group-[.open]:block absolute w-48 lg:w-96 h-80 bottom-[153%] rounded-t-lg
                        right-0 lg:-right-10 bg-base-300 overflow-y-auto z-10"
                             onClick={event => event.stopPropagation()}>
                            <GifsSection />
                        </div>
                        <MdOutlineGifBox
                            className="absolute top-0 right-1 cursor-pointer text-gray-500 hover:text-gray-700"
                            size={32} onClick={event => {
                                event.stopPropagation();

                                const parent = event.currentTarget.parentElement as HTMLDivElement;
                                console.log("click", parent);
                                parent.classList.toggle("open");
                        }}/>
                    </div>

                </div>

                <button disabled={watchMessage?.length == 0 && watchImage?.length == 0}
                        className="btn btn-circle btn-sm hover:shadow-md btn-primary">
                    <HiPaperAirplane/>
                </button>
            </form>
            {watchImage &&
                <div className="relative w-32 h-32 shadow rounded-md overflow-hidden ml-3 mb-1">
                    <button className="btn btn-ghost btn-xs btn-circle absolute top-1 right-1"
                            onClick={() => setValue("image", "")}>
                        <FaXmark size={20}/>
                    </button>
                    <Image src={watchImage} alt="Message photo" width={280} height={280}
                           className="object-cover h-full w-full"/>
                </div>
            }
        </div>
    );
}