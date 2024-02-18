import getConversationById from "@/app/conversations/[conversationId]/actions";
import { redirect } from "next/navigation";
import ConversationHeader from "@/app/conversations/[conversationId]/components/ConversationHeader";
import ConversationBody from "@/app/conversations/[conversationId]/components/ConversationBody";
import AddNewMessageForm from "@/app/conversations/[conversationId]/components/AddNewMessageForm";

interface ConversationPageProps {
    params: {
        conversationId: string,
    }
}

export default async function ConversationPage({ params: { conversationId } }: ConversationPageProps) {

    const conversation = await getConversationById(conversationId);

    if (!conversation) {
        return redirect("/404");
    }

    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <ConversationHeader conversation={conversation} />
                <ConversationBody />
                <AddNewMessageForm  />
            </div>
        </div>
    )

}