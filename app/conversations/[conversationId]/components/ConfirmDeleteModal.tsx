import Modal from "@/app/components/Modal";
import { LuAlertTriangle } from "react-icons/lu";
import toast from "react-hot-toast";
import { deleteConversationById } from "@/app/lib/db/conversation";
import useConversation from "@/app/hooks/useConversation";


export default function ConfirmDeleteModal() {

    const { conversationId } = useConversation();

    async function handleDelete() {
        try {
            await deleteConversationById(conversationId);
        } catch (err: any) {
            toast.error("Something went wrong while deleting this conversation")
        }
    }

    return (
        <Modal id="delete-conversation">
            <div className="flex items-start gap-2">
                <div className="p-2 rounded-full bg-error">
                    <LuAlertTriangle size={24}/>
                </div>
                <div>
                    <h2 className="text-lg font-bold">Delete conversation?</h2>
                    <p>Are you sure to delete this conversation? This action can not be undone</p>
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