import { LuAlertTriangle } from "react-icons/lu";
import Modal from "@/app/components/Modal";
import { deleteMessageById, FullMessage } from "@/app/lib/db/message";
import toast from "react-hot-toast";

interface ConfirmMessageDeleteModalProps {
    message: FullMessage,
}

export default function ConfirmMessageDeleteModal({ message }: ConfirmMessageDeleteModalProps) {

    async function handleDelete() {
        try {
            await deleteMessageById(message.id);
        } catch (err: any) {
            toast.error("Something went wrong while deleting this message")
        }
    }

    return (
        <Modal id={`delete-message-${message.id}`}>
            <div className="flex items-start gap-2">
                <div className="p-2 rounded-full bg-error">
                    <LuAlertTriangle size={24}/>
                </div>
                <div>
                    <h2 className="text-lg font-bold">Delete message?</h2>
                    <p>Are you sure to delete this message? This action can not be undone</p>
                    <div className="modal-action  mt-4">
                        <form method="dialog">
                            <button className="btn btn-sm rounded-lg btn-ghost mr-2">Cancel</button>
                            <button className="btn btn-sm rounded-lg btn-error" onClick={handleDelete}>Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    )
}