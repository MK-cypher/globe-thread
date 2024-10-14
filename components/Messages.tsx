"use client";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useUser} from "@/context/userContext";
import {MessagesType} from "@/lib/types";
import {ArrowDown, Reply} from "lucide-react";
import {useEffect, useOptimistic, useRef, useState} from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import {deleteMsg, getMessages} from "@/actions/chat";
import {toast} from "./ui/use-toast";
import {createClient} from "@/lib/db/client";
import {deleteMsgConversation, getConversation} from "@/actions/conversations";
import {MSGS_PER_PAGE} from "@/lib/consts";
import {dateSeperator, dayDifference} from "@/lib/datesFormats";

type MsgRef = {
  id: null | string;
  text: string;
  username?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string | null;
};

export default function Messages({
  messages,
  type,
  conversationId,
}: {
  messages: MessagesType[];
  type: "public" | "private";
  conversationId?: string;
}) {
  const [edit, setEdit] = useState<MsgRef>({id: null, text: ""});
  const [reply, setReply] = useState<MsgRef>({id: null, text: ""});
  const [optimisticMessages, setOptimisticMessages] = useState(messages);
  const [optimisticIds, setOptimisticIds] = useState<string[]>([]);
  const [scrollBtn, setScrollBtn] = useState(false);
  const [newUnseenMsgs, setNewUnseenMsgs] = useState(0);
  const [range, setRange] = useState([MSGS_PER_PAGE + 1, MSGS_PER_PAGE * 2 + 1]);
  const [finalMsg, setFinalMsg] = useState(false);
  const [previousMsg, setPreviousMsg] = useState(optimisticMessages[0]);
  const chatContainerRef = useRef<any>(null);
  const user = useUser();
  const msg = messages[0];

  useEffect(() => {
    if (optimisticMessages.length > 0) {
      setOptimisticIds((prev) => [...prev, optimisticMessages[0].id]);
    }
  }, [optimisticMessages]);

  useEffect(() => {
    const supabase = createClient();

    const changes = supabase
      .channel(conversationId ? conversationId : "global-chat")
      .on(
        // @ts-ignore
        "postgres_changes",
        {event: "INSERT", schema: "public", table: conversationId ? "conversations" : "chat"},
        async (payload: {eventType: string; new: MessagesType; old: {id: string}}) => {
          let newMsg: MessagesType;
          let reply_content;
          if (!optimisticIds.includes(payload.new.id)) {
            const {data, error} = await supabase.from("users").select("username,avatar").eq("id", payload.new.from);
            if (data) {
              reply_content = {
                text: payload.new.text,
                reply_user: {
                  username: data[0].username,
                  avatar: data[0].avatar,
                },
              };
            }
            if (payload.new.reply_to != payload.new.id) {
              const {data, error} = await supabase
                .from(conversationId ? "conversations" : "chat")
                .select("from,text")
                .eq("id", payload.new.reply_to);
              if (data && !error) {
                const {data: user2, error: error2} = await supabase
                  .from("users")
                  .select("username,avatar")
                  .eq("id", data[0].from);
                if (!error2 && user2) {
                  reply_content = {
                    text: data[0].text,
                    reply_user: {
                      username: user2[0].username,
                      avatar: user2[0].avatar,
                    },
                  };
                }
              }
            }
            if (!error && data) {
              newMsg = {
                ...payload.new,
                from_user: {username: data[0].username, avatar: data[0].avatar},
                reply_content,
              };
              setOptimisticMessages((prev: any) => [newMsg, ...prev]);
            }
          }
          setNewUnseenMsgs((current) => current + 1);
        }
      )
      .on(
        // @ts-ignore
        "postgres_changes",
        {event: "UPDATE", schema: "public", table: conversationId ? "conversations" : "chat"},
        async (payload: {eventType: string; new: MessagesType; old: {id: string}}) => {
          setOptimisticMessages(
            optimisticMessages.map((item: MessagesType) =>
              item.id == payload.new.id ? {...item, text: payload.new.text, updated_at: payload.new.updated_at} : item
            )
          );
        }
      )
      .on(
        //@ts-ignore
        "postgres_changes",
        {event: "*", schema: "public", table: conversationId ? "conversations" : "chat"},
        async (payload: {eventType: string; new: MessagesType; old: {id: string}}) => {
          if (payload.eventType == "DELETE") {
            setOptimisticMessages(optimisticMessages.filter((item) => item.id != payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, [optimisticIds]);

  const removeMsg = async (id: string) => {
    setOptimisticMessages(optimisticMessages.filter((item) => item.id != id));
    const {error} = JSON.parse(type == "public" ? await deleteMsg(id) : await deleteMsgConversation(id));

    if (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  function handleScroll(e: any) {
    const chatContainer = chatContainerRef.current;
    const isScrolled = chatContainer.scrollTop < -80;
    const isTop = chatContainer.scrollHeight - chatContainer.clientHeight - 2 + chatContainer.scrollTop < 0;
    if (isTop && !finalMsg) {
      loadMore();
    }
    if (isScrolled) {
      setScrollBtn(true);
    } else {
      setNewUnseenMsgs(0);
      setScrollBtn(false);
    }
  }

  async function loadMore() {
    const data = conversationId
      ? await getConversation(conversationId, range[0], range[1])
      : await getMessages(range[0], range[1]);
    if (data.length == 0) {
      setFinalMsg(true);
    }
    setOptimisticMessages((prev) => [...prev, ...data]);
    setRange((current) => [current[0] + MSGS_PER_PAGE + 1, current[1] + MSGS_PER_PAGE + 1]);
  }

  return (
    <div className="flex flex-col w-full relative">
      {scrollBtn && (
        <button
          onClick={() => {
            chatContainerRef.current.scrollTop = 0;
            setNewUnseenMsgs(0);
          }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-blue-500 p-2 cursor-pointer hover:scale-[1.01] hover:shadow-lg text-white transition-all duration-300 z-10"
        >
          {newUnseenMsgs > 0 && (
            <div className="relative transition-all duration-300">
              {newUnseenMsgs > 1 && newUnseenMsgs} new messages{" "}
              <div className="absolute w-2 h-2 bg-red-500 rounded-full top-0 -right-2"></div>
            </div>
          )}

          <ArrowDown />
        </button>
      )}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="p-2 w-full space-y-5 flex-grow max-h-[calc(100svh-140px)] overflow-auto flex flex-col-reverse scroll-smooth"
      >
        {optimisticMessages.length > 0 &&
          optimisticMessages.map((item, i) => {
            const diff = dayDifference(item.created_at, optimisticMessages[i + 1]?.created_at);

            // setPreviousMsg(item);
            return (
              // <>
              <div key={item.id} className="flex flex-col-reverse">
                <div key={item.id} className="chat-bubble">
                  {item.from == user?.id ? (
                    <div className={`${item.reply_to ? "mt-5" : ""} relative w-full flex items-center gap-3`}>
                      <ChatBubble msg={item} type="own" />
                      <div className="min-w-[22px]">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="space-y-1 transition-all duration-300 hover:bg-secondary rounded-full py-1 px-2.5 chat-action">
                            <span className="w-0.5 h-0.5 block bg-foreground rounded-full"></span>
                            <span className="w-0.5 h-0.5 block bg-foreground rounded-full"></span>
                            <span className="w-0.5 h-0.5 block bg-foreground rounded-full"></span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setEdit({id: item.id, text: item.text});
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                removeMsg(item.id);
                              }}
                            >
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`${item.reply_to ? "mt-5" : ""} relative w-full flex justify-start items-center gap-3`}
                    >
                      <ChatBubble msg={item} type="other" />
                      {user && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={() => {
                                setReply({
                                  id: item.id,
                                  text: item.text,
                                  username: item.from_user.username,
                                  avatar: item.from_user.avatar,
                                  updated_at: item.updated_at,
                                  created_at: item.created_at,
                                });
                              }}
                              className="chat-action transition-all duration-300 hover:bg-secondary rounded-full p-1"
                            >
                              <Reply size={18} />
                            </TooltipTrigger>
                            <TooltipContent className="z-[100]">
                              <p>Reply</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  )}
                </div>
                {diff && (
                  <div className="my-3 flex items-center gap-5">
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent to-foreground/10 "></div>
                    <div className="shrink-0 text-muted-foreground">{dateSeperator(item.created_at)}</div>
                    <div className="w-full h-0.5 bg-gradient-to-r from-foreground/10 to-transparent"></div>
                  </div>
                )}
              </div>
              // </>
            );
          })}
      </div>
      <ChatInput
        type={type}
        edit={edit}
        setEdit={setEdit}
        reply={reply}
        setReply={setReply}
        msg={msg}
        user={user}
        messages={optimisticMessages}
        setOptimisticMessages={setOptimisticMessages}
      />
    </div>
  );
}
