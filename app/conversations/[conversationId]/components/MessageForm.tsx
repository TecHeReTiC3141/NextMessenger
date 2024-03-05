"use client"

import useConversation from "@/app/hooks/useConversation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddMessageFormSchema } from "@/app/lib/schema";
import { z } from "zod";
import { MdPhoto } from "react-icons/md";
import { HiPaperAirplane } from "react-icons/hi2";
import { handleMessageFormSubmit } from "@/app/conversations/[conversationId]/actions";
import toast from "react-hot-toast";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { FaXmark } from "react-icons/fa6";
import { Message } from ".prisma/client";
import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


type formFields = z.infer<typeof AddMessageFormSchema>;

interface AddNewMessageFormProps {
    editedMessage: Message | null
}

export default function MessageForm({ editedMessage }: AddNewMessageFormProps) {

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


    const watchImage = watch("image");
    const watchMessage = watch("message");

    const onSubmit: SubmitHandler<formFields> = async (data) => {
        console.log(data);
        const res = await handleMessageFormSubmit(data as unknown as FormData, editedMessage?.id);
        if (!res) {
            toast.error("Something went wrong while sending your message. Please try again later");
            return;
        }
        if (editedMessage) {
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
        replace(`${pathname}?${searchParamsWithoutEdit.toString()}`);
        setValue("message", "");
        setValue("image", "");
    }

    return (
        <div className="w-full relative">

            {editedMessage && (
                <div
                    className="absolute w-full bottom-full left-0 px-2 py-1 bg-base-300 flex justify-between items-center z-10">
                    <div>
                        <p className="text-sm text-sky-500">Editing...</p>
                        {editedMessage.body}
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
                <input type="text" className="flex-1 input input-sm focus:outline-none rounded-full bg-base-200" id="message-form-body"
                       placeholder="Write a message..." {...register("message")} autoFocus={editedMessage !== null} />
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