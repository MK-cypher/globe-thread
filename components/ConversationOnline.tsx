"use client";
import {createClient} from "@/lib/db/client";
import React, {ReactNode, useEffect, useState} from "react";

type props = {
  user: any;
  conversationId: string;
  children: ReactNode;
  from: string;
  to: string;
};

export default function ConversationOnline({user, conversationId, children, from, to}: props) {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (user) {
      const supabase = createClient();
      const channel = supabase.channel(`online-${conversationId}`);
      channel
        .on("presence", {event: "sync"}, () => {
          const channelData = channel.presenceState();
          const ids: string[] = [];

          for (const id in channelData) {
            // @ts-ignore
            const userId = channelData[id][0].userId;
            if (!ids.includes(userId)) {
              ids.push(userId);
            }
          }
          if (ids.length == 2) {
            setOnline(true);
          } else {
            setOnline(false);
          }
        })
        .subscribe(async (status) => {
          if (status == "SUBSCRIBED") {
            await channel.track({userId: user?.id});
          }
        });

      return () => {
        channel.unsubscribe();
      };
    }
  }, []);

  return (
    <div className="relative">
      {children}
      <div
        className={`${
          online ? "bg-success" : "bg-gray-500"
        } absolute bottom-0 right-0 w-3 h-3 rounded-full outline outline-1.5 outline-secondary`}
      ></div>
    </div>
  );
}
