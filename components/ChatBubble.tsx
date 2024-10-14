"use client";
import {hourminute, msgDate} from "@/lib/datesFormats";
import {MessagesType} from "@/lib/types";
import {User2} from "lucide-react";
import React from "react";

type props = {
  msg: MessagesType;
  type: "own" | "other";
};

export default function ChatBubble({msg, type}: props) {
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
            <div className={`text-nowrap ${type == "own" ? "text-primary" : ""}`}>{msg.from_user.username}</div>
            <div className="text-muted-foreground text-sm">{msgDate(msg.created_at)}</div>
            {msg.updated_at && <div className="text-muted-foreground text-sm">({"edited"})</div>}
          </div>
          <pre className="text-foreground/70 chat-message font-sans">{msg.text}</pre>
        </div>
      </div>
    </div>
  );
}
