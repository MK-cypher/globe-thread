"use client";
import {hourminute, msgDate} from "@/lib/datesFormats";
import {MessagesType} from "@/lib/types";
import {User2} from "lucide-react";
import React from "react";
import {Dialog, DialogTrigger} from "./ui/dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "./ui/dropdown-menu";
import Link from "next/link";
import {startConversation} from "@/actions/conversations";
import {useRouter} from "next/navigation";

type props = {
  msg: MessagesType;
  type: "own" | "other";
};

export default function ChatBubble({msg, type}: props) {
  const router = useRouter();
  const sendDM = async (to: string) => {
    //
    const {url} = JSON.parse(await startConversation(to, ""));
    if (url) {
      router.push(url);
    }
  };
  return (
    <div className="relative">
      {msg.reply_to != msg.id && (
        <>
          <div className="">
            <div className="absolute h-10 w-8 border-foreground border rounded-sm left-3 top-2 border-b-transparent border-r-transparent"></div>
          </div>
          <div className="flex items-center gap-2 text-xs mb-3 relative">
            <div className="w-5 h-5 shrink-0 ml-8">
              <img src={msg.reply_content?.reply_user.avatar} alt="user" className="w-5 h-5 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
              <div className="text-nowrap">@{msg.reply_content?.reply_user.username}</div>
              <div
                className="text-muted-foreground line-clamp-1 cursor-pointer"
                onClick={() => {
                  console.log(msg.id);
                }}
              >
                {msg.reply_content?.text}
              </div>
            </div>
          </div>
        </>
      )}
      <div className="flex items-start gap-3 relative">
        <div className={`w-8 h-8 shrink-0 ${type == "own" ? "outline rounded-full outline-2 outline-primary" : ""}`}>
          {msg.from_user.avatar ? (
            <img src={msg.from_user.avatar} alt="user" className="w-8 h-8 rounded-full" />
          ) : (
            <User2 className="w-8 h-8" />
          )}
        </div>
        <div className="">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  className={`text-nowrap ${
                    type == "own" ? "text-primary" : ""
                  } relative before:absolute before:w-0 before:h-[1px] before:bg-primary before:bottom-0 before:left-0 hover:before:w-full before:transition-all before:duration-300`}
                >
                  {msg.from_user.username}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Link href={`/profile/${msg.public_id}`}>Profile</Link>
                </DropdownMenuItem>
                {type == "other" && (
                  <DropdownMenuItem
                    onClick={() => {
                      sendDM(msg.from);
                    }}
                  >
                    Dirct Message
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="text-muted-foreground text-sm">{msgDate(msg.created_at)}</div>
            {msg.updated_at && <div className="text-muted-foreground text-sm">({"edited"})</div>}
          </div>
          <pre className="text-foreground/70 chat-message font-sans">{msg.text}</pre>
        </div>
      </div>
    </div>
  );
}
