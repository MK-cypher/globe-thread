"use client";
import {getUser} from "@/actions/users";
import {ddmmyyyyhm} from "@/lib/datesFormats";
import {ArrowLeft, ArrowRight, Ghost, Globe2Icon} from "lucide-react";
import Link from "next/link";
import GlobalOnline from "./GlobalOnline";
import ConversationOnline from "./ConversationOnline";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";

export default function ConversationsMenu({conversations, user}: {conversations: any; user: any}) {
  const [navState, setNavState] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const scrollTest = ["", "", "", "", "", "", "", "", "", "", ""];

  useEffect(() => {
    const savedNavState = localStorage.getItem("conversation-state");
    if (savedNavState) {
      setNavState(savedNavState !== "closed");
    } else {
      setNavState(true);
      localStorage.setItem("conversation-state", "open");
    }
    setReady(true);
  }, []);

  return (
    <>
      {ready && (
        <aside
          className={`${
            navState ? "opened" : "closed"
          } h-[calc(100svh-80px)] z-20 text-foreground bg-secondary/85 p-2 backdrop-blur-lg `}
        >
          <div className={`ml-auto p-2 w-fit nav-btn flex justify-center items-center`}>
            <button
              onClick={() => {
                navState
                  ? localStorage.setItem("conversation-state", "closed")
                  : localStorage.setItem("conversation-state", "open");
                setNavState(!navState);
              }}
            >
              <ArrowRight className={`${navState ? "rotate-180" : ""} duration-300 transition-all`} />
            </button>
          </div>
          <div className={`overflow-hidden`}>
            <Link
              href={`/global-chat`}
              className={`${
                pathname == "/global-chat" ? "bg-popover" : ""
              } p-2 rounded-lg hover:bg-popover transition-all duration-300 flex items-start gap-3 mb-3 ${
                !navState && "justify-center"
              }`}
            >
              <div className="w-10 h-10 shrink-0 rounded-full">
                <Globe2Icon className="w-10 h-10 rounded-full" />
              </div>
              <div className={`${!navState && "hidden"}`}>
                <div className="font-semibold text-nowrap">Global Chat</div>
                <div>
                  <GlobalOnline user={user} />
                </div>
              </div>
            </Link>
            <div className="hr h"></div>
            <div className={`${!navState && "hidden"} font-semibold mb-3 text-nowrap`}>Conversations</div>
            <div className="h-[calc(100svh-224px)] overflow-auto ">
              {conversations && conversations.length > 0 ? (
                conversations.map((item: any) => {
                  if (item.text) {
                    return (
                      <Link
                        href={`/conversations/${item.conversation_id}`}
                        key={item.conversation_id}
                        className={`${
                          pathname == `/conversations/${item.conversation_id}` ? "bg-popover" : ""
                        } p-2 rounded-lg hover:bg-popover transition-all duration-300 flex items-start gap-3 ${
                          !navState && "justify-center"
                        }`}
                      >
                        <ConversationOnline
                          user={user}
                          from={item.from}
                          to={item.to}
                          conversationId={item.conversation_id}
                        >
                          <div className="w-10 h-10 shrink-0 rounded-full">
                            <img src={item.avatar || "/user.png"} alt="user" className="w-10 h-10 rounded-full" />
                          </div>
                        </ConversationOnline>
                        <div className={`${!navState && "hidden"} text-nowrap`}>
                          <div className="font-semibold line-clamp-1">{item.username}</div>
                          <div className="text-muted-foreground">{ddmmyyyyhm(item.created_at)}</div>
                        </div>
                      </Link>
                    );
                  }
                })
              ) : (
                <div className="flex justify-center">
                  <div className="text-sm text-muted-foreground">No Direct Messages</div>
                </div>
              )}
              {/* {scrollTest.map((item, i) => (
                <Link
                  href={``}
                  key={i}
                  className={`${
                    pathname == `/conversations/` ? "bg-popover" : ""
                  } p-2 rounded-lg hover:bg-popover transition-all duration-300 flex items-start gap-3 ${
                    !navState && "justify-center"
                  }`}
                >
                  <div className="w-10 h-10 shrink-0 rounded-full">
                    <img src={"/user.png"} alt="user" className="w-10 h-10 rounded-full" />
                  </div>
                  <div className={`${!navState && "hidden"} text-nowrap`}>
                    <div className="font-semibold line-clamp-1">test</div>
                    <div className="text-muted-foreground">testtest</div>
                  </div>
                </Link>
              ))} */}
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
