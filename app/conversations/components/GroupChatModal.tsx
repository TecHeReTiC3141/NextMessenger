import Modal from "@/app/components/Modal";
import ConversationsListProps from "@/app/conversations/components/ConversationsList";
import { User } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateGroupChatSchema } from "@/app/lib/schema";
import { z } from "zod";

interface GroupChatModalProps {
    users: User[],
}

type FormInputs = z.infer<typeof CreateGroupChatSchema>;

export default function GroupChatModal({ users }: GroupChatModalProps) {

    const {
        register,
        setValue,
        reset,
        watch,
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<FormInputs>({
        defaultValues: {
            name: '',
            members: [],
        },
        resolver: zodResolver(CreateGroupChatSchema)
    });

    const members = watch("members");

    const onSubmit: SubmitHandler<FormInputs> = (data) => {

    }

    return (
        <Modal id="add-group-chat">
            <div>
                <h2 className="text-lg font-bold">Create a group chat</h2>
                <p className="my-1">Create a chat with more than two people</p>
                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Name</span>
                        </div>
                        <input type="text"
                               className="input input-bordered w-full focus:ring-2 focus:ring-sky-500" {...register("name")}/>
                    </label>
                </form>
            </div>
        </Modal>
    )
}