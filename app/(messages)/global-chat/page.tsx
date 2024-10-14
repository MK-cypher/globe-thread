import {getMessages} from "@/actions/chat";
import Messages from "@/components/Messages";
import {MessagesType} from "@/lib/types";

export default async function page() {
  const messages = (await getMessages()) as MessagesType[];
  return <Messages messages={messages} type="public" />;
}
