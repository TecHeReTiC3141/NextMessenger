"use client"

import useConversation from "@/app/hooks/useConversation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { AddMessageFormSchema } from "@/app/lib/schema";
import { z } from "zod";
import { MdPhoto } from "react-icons/md";
import { HiPaperAirplane } from "react-icons/hi2";
import { handleNewMessage } from "@/app/conversations/[conversationId]/actions";
import toast from "react-hot-toast";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { FaXmark } from "react-icons/fa6";


type formFields = z.infer<typeof AddMessageFormSchema>;

export default function AddNewMessageForm() {

    const { conversationId } = useConversation();

    // TODO: add Tenor client for gifs

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
            image: "",
        }
    });

    const watchImage = watch("image");
    const watchMessage = watch("message");

    const onSubmit: SubmitHandler<formFields> = async (data) => {
        console.log(data);
        const res = await handleNewMessage(data as unknown as FormData);
        if (!res) {
            toast.error("Something went wrong while sending your message. Please try again later");
            return;
        }
        reset();
    }

    async function onUpload(result: any) {
        setValue("image", result?.info?.secure_url || "");
    }

    return (
        <div className="w-full">

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
                <input type="text" className="flex-1 input input-sm focus:outline-none rounded-full bg-base-200"
                       placeholder="Write a message..." {...register("message")} />
                <button disabled={watchMessage?.length == 0 && watchImage?.length == 0}
                        className="btn btn-circle btn-sm hover:shadow-md btn-primary">
                    <HiPaperAirplane/>
                </button>
            </form>
            {watchImage &&
                <div className="relative w-32 h-32 shadow rounded-md overflow-hidden ml-3 mb-1">
                    <button className="btn btn-ghost btn-xs btn-circle absolute top-1 right-1" onClick={() => setValue("image", "")}>
                        <FaXmark size={20}/>
                    </button>
                    <Image src={watchImage} alt="Message photo" width={280} height={280}
                           className="object-cover h-full w-full"/>
                </div>
            }
        </div>
    );
}