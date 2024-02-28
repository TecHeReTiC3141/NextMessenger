import { SessionUser, updateUserSettings } from "@/app/lib/db/user";
import Modal, { closeModal, openModal } from "@/app/components/Modal";
import { z } from "zod";
import { UserSettingsFormSchema } from "@/app/lib/schema";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import avatarPlaceholder from "@/public/images/avatar-placeholder.jpg"
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import toast from "react-hot-toast";
import SubmitBtn from "@/app/components/SubmitBtn";

interface SettingsModalProps {
    user: NonNullable<SessionUser>,
}

type FormInputs = z.infer<typeof UserSettingsFormSchema>;

export default function SettingsModal({ user }: SettingsModalProps) {

    const {
        register,
        handleSubmit,
        formState: { errors, isLoading },
        setValue,
        reset,
        watch,
        control,
    } = useForm<FormInputs>({
        defaultValues: {
            name: user.name as string,
            image: user.image || avatarPlaceholder.src,
            description: user.description || "",
        },
        resolver: zodResolver(UserSettingsFormSchema),
    });

    const image = watch("image");

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const updatedUser = await updateUserSettings(data as FormData);
            if (updatedUser === null) {
                toast.error("Could not update your settings")
            } else {
                toast.success("Successfully updated your profile");
                closeModal("settings-modal");
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    function onUpload(result: any) {
        setValue("image", result?.info?.secure_url);
        openModal("settings-modal");

    }

    return (
        <Modal id="settings-modal">
            <div>
                <h2 className="font-bold text-lg">Edit profile</h2>
                <p>Edit your public information</p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-full">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Name</span>
                        </div>
                        <input type="text"
                               className="input input-bordered w-full focus:ring-2 focus:ring-sky-500" {...register("name")}/>
                    </label>

                    <div className="label">
                        <span className="label-text">Photo</span>
                    </div>
                    <div className="flex gap-2">
                        <Image src={image || user.image || avatarPlaceholder} alt="User profile" width={288}
                               height={288} className="object-cover rounded-full w-12 h-12"/>
                        <CldUploadButton
                            options={{ maxFiles: 1 }}
                            onUpload={onUpload}
                            uploadPreset="uupnbab6">
                            <div className="btn btn-primary" onClick={() => closeModal("settings-modal")}>
                                Change
                            </div>
                        </CldUploadButton>
                    </div>
                    <input type="hidden" {...register("image")}/>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Description</span>
                        </div>
                        <input type="text"
                               className="input input-bordered w-full focus:ring-2 focus:ring-sky-500" {...register("description")}/>
                    </label>
                    <div className="flex w-full justify-end">
                        <div className="modal-action  mt-4">
                            <button className="btn btn-sm rounded-lg btn-ghost mr-2" onClick={ev => {
                                ev.preventDefault();
                                closeModal("settings-modal");
                            }}>Cancel</button>
                            <SubmitBtn className="btn-sm" control={control} >Save</SubmitBtn>
                        </div>
                    </div>
                </form>
            </div>

        </Modal>
    )
}