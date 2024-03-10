import Modal, { closeModal } from "@/app/components/Modal";
import { User } from "@prisma/client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateGroupChatSchema } from "@/app/lib/schema";
import { z } from "zod";
import ReactSelect from "react-select";
import SubmitBtn from "@/app/components/SubmitBtn";
import makeAnimated from 'react-select/animated';
import { createGroupChat } from "@/app/lib/db/conversation";
import toast from "react-hot-toast";


interface GroupChatModalProps {
    users: User[],
}

type FormInputs = z.infer<typeof CreateGroupChatSchema>;

export default function GroupChatModal({ users }: GroupChatModalProps) {

    // TODO: implement editing of group chats

    const animatedComponents = makeAnimated();

    const {
        register,
        setValue,//
        reset,
        watch,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormInputs>({
        defaultValues: {
            name: '',
            members: [],
        },
        resolver: zodResolver(CreateGroupChatSchema)
    });

    const members = watch("members");

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        console.log(data);
        const res = await createGroupChat(data as FormData);
        if (res === null) {
            toast.error("Error while creating your group chat. Please, try again later");
        } else {
            toast.success("Your group chat has been created, enjoy your new conversations!");
            closeModal("add-group-chat");
            reset();
        }
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
                               className="input input-sm input-bordered w-full focus:ring-2 focus:ring-sky-500" {...register("name")}/>
                        {errors.name !== undefined && <p className="text-error">{errors.name?.message?.toString()}</p>}
                    </label>
                    <label className="form-control w-full relative">
                        <div className="label">
                            <span className="label-text">Members</span>
                        </div>

                        <ReactSelect className="z-[999]"
                                     components={animatedComponents}
                                     options={users.map(user => ({
                                         label: user.name as string,
                                         value: user.id,
                                     }))}
                                     isMulti
                                     value={members}
                                     onChange={value => {
                                         console.log(value);
                                         setValue("members", value as { label: string, value: string }[]);
                                     }}
                                     maxMenuHeight={90}
                        />
                        {errors.members !== undefined && <p className="text-error">{errors.members?.message?.toString()}</p>}
                    </label>
                    <div className="flex w-full justify-end pt-24">
                        <div className="modal-action  mt-4">
                            <button className="btn btn-sm rounded-lg btn-ghost mr-2" onClick={ev => {
                                ev.preventDefault();
                                closeModal("add-group-chat");
                            }}>Cancel
                            </button>
                            <SubmitBtn className="btn-sm" control={control}>Create</SubmitBtn>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    )
}