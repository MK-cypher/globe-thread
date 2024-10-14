import {getConversation} from "@/actions/conversations";
import Messages from "@/components/Messages";
import {type MessagesType} from "@/lib/types";

export default async function page({params: {id}}: {params: {id: string}}) {
  const conversation = (await getConversation(id)) as MessagesType[];
  return <Messages messages={conversation} type="private" conversationId={id} />;
}
