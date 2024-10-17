import {Reply, SendHorizonal, X} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import {toast} from "@/components/ui/use-toast";
import {replyPublicMsg, sendPublicMsg, updatePublicMsg} from "@/actions/chat";
import {replyPrivateMsg, sendPrivateMsg, updatePrivateMsg} from "@/actions/conversations";
import {MessagesType} from "@/lib/types";
import {v4 as uuidv4} from "uuid";

type MsgRef = {
  id: null | string;
  text: string;
  username?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string | null;
};

type props = {
  type: "public" | "private";
  edit?: MsgRef;
  setEdit?: any;
  reply?: MsgRef;
  setReply?: any;
  msg?: MessagesType;
  user: any;
  messages: MessagesType[];
  setOptimisticMessages: any;
};

export default function ChatInput({
  type,
  edit,
  setEdit,
  reply,
  setReply,
  msg,
  user,
  messages,
  setOptimisticMessages,
}: props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const textAreaRef = useRef<any>(null);

  useEffect(() => {
    if (edit) setMessage(edit.text);
    const textarea = textAreaRef.current;
    if (textarea && edit?.id) {
      textarea.focus();
    }
  }, [edit]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea && reply?.id) {
      textarea.focus();
    }
  }, [reply]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    textarea.style.height = "auto";
    const newHeight = textarea.scrollHeight - 10;
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  const submit = async () => {
    setLoading(true);
    if (message.length > 0 && message.trim() != "" && user) {
      const id = uuidv4();
      const newMsg: MessagesType = {
        id,
        created_at: new Date().toISOString(),
        updated_at: edit?.id ? new Date().toISOString() : null,
        from: user.id,
        from_user: {
          username: user.username,
          avatar: user.avatar,
        },
        text: message,
        // @ts-ignore
        reply_to: reply.id ? reply.id : id,
        // @ts-ignore
        reply_content: {
          text: reply?.id ? reply.text : message,
          reply_user: {
            username: reply?.id ? reply.username : user.username,
            avatar: reply?.id ? reply.avatar : user.avatar,
          },
        },
      };
      setMessage("");
      setEdit({id: null, text: ""});
      setReply({id: null, text: ""});
      if (reply && reply.id) {
        setOptimisticMessages((prev: any) => [newMsg, ...prev]);
        const {error, variant} = JSON.parse(
          type == "public"
            ? await replyPublicMsg(id, message, reply.id)
            : // @ts-ignore
              await replyPrivateMsg(id, message, reply.id, msg)
        );
        if (error) {
          toast({
            title: error,
            variant,
          });
        }
      } else if (edit && edit.id) {
        setOptimisticMessages(messages.map((item: MessagesType) => (item.id == edit.id ? newMsg : item)));
        const {error, variant} = JSON.parse(
          type == "public" ? await updatePublicMsg(message, edit.id) : await updatePrivateMsg(message, edit.id)
        );
        if (error) {
          toast({
            title: error,
            variant,
          });
        }
      } else {
        setOptimisticMessages((prev: any) => [newMsg, ...prev]);
        const {error, variant} = JSON.parse(
          //@ts-ignore
          type == "public" ? await sendPublicMsg(id, message) : await sendPrivateMsg(id, message, msg)
        );
        if (error) {
          toast({
            title: error,
            variant,
          });
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className="w-full pr-2 pb-2 flex items-start gap-3 mt-3">
      <div className="w-full">
        {(edit && edit.id) || (reply && reply.id) ? (
          <div className="text-muted-foreground flex justify-between items-center gap-5 py-1">
            <div className="flex items-center gap-2">
              {reply && reply.id && (
                <div className="rotate-180">
                  <Reply />
                </div>
              )}
              <div className="line-clamp-1">{edit?.text || reply?.text}</div>
            </div>
            <button
              onClick={() => {
                setEdit({id: null, text: ""});
                setReply({id: null, text: ""});
                setMessage("");
              }}
              className="rounded-full p-1 bg-secondary"
            >
              <X />
            </button>
          </div>
        ) : (
          <></>
        )}
        <div className={`${!user && "disabled-btn"} flex items-start gap-3 relative`}>
          <textarea
            name="chat-input"
            id="chat-input"
            placeholder={`${user ? "Your Message" : "Login to send messages"}`}
            className={`${message && message.length >= 500 && "text-destructive"} min-h-2 max-h-32 resize-none w-full`}
            ref={textAreaRef}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key == "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            value={message ? message : ""}
            readOnly={false}
          />
          <button onClick={submit}>
            <SendHorizonal />
          </button>
        </div>
      </div>
    </div>
  );
}
