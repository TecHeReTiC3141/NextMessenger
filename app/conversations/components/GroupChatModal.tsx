import Modal from "@/app/components/Modal";
import ConversationsListProps from "@/app/conversations/components/ConversationsList";
import { User } from "@prisma/client";

interface GroupChatModalProps {
    users: User[],
}

export default function GroupChatModal({ users }: GroupChatModalProps) {
    return (
        <Modal id="add-gruop-chat">
            <div></div>
        </Modal>
    )
}