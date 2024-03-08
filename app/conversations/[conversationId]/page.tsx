import getConversationById, {
    getAnsweredMessage,
    getEditedMessage
} from "@/app/conversations/[conversationId]/actions";
import { redirect } from "next/navigation";
import ConversationHeader from "@/app/conversations/[conversationId]/components/ConversationHeader";
import ConversationBody from "@/app/conversations/[conversationId]/components/ConversationBody";
import MessageForm from "@/app/conversations/[conversationId]/components/MessageForm";

interface ConversationPageProps {
    params: {
        conversationId: string,
    },
    searchParams: {
        edited?: string,
        answering?: string,
    }
}

export default async function ConversationPage({ params: { conversationId }, searchParams: {edited, answering} }: ConversationPageProps) {

    const conversation = await getConversationById(conversationId);

    if (!conversation) {
        return redirect("/404");
    }

    const editedMessage = edited ?  await getEditedMessage(edited) : null;
    const answeredMessage = answering ?  await getAnsweredMessage(answering) : null;

    return (
        <div className="lg:pl-80 h-full max-h-full">
            <div className="h-full flex flex-col">
                <ConversationHeader conversation={conversation}/>

                <ConversationBody initialMessages={conversation.messages}/>
                <MessageForm editedMessage={editedMessage} answeringMessage={answeredMessage}/>
            </div>
        </div>
    )

}