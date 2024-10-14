"use client";
import {createClient} from "@/lib/db/client";
import React, {useEffect, useState} from "react";

type props = {
  user: any;
};

export default function GlobalOnline({user}: props) {
  const [online, setOnline] = useState(0);

  useEffect(() => {
    if (user) {
      const supabase = createClient();
      const channel = supabase.channel("global-presence");
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
          setOnline(ids.length);
        })
        .subscribe(async (status) => {
          if (status == "SUBSCRIBED") {
            await channel.track({userId: user?.id});
          }
        });
    }
  }, []);

  return <div className="text-sm text-success text-nowrap">{online} Online</div>;
}
