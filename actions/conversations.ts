"use server";

import {MSGS_PER_PAGE} from "@/lib/consts";
import createSupabaseServerClient from "@/lib/db/server";
import {MessagesType} from "@/lib/types";
import {getTimeStampz} from "@/lib/utils";
import {v4 as uuidv4} from "uuid";

export const getAllConversations = async () => {
  const supabase = createSupabaseServerClient();

  const {data, error} = await supabase.auth.getUser();

  if (!error) {
    const user_id = data.user?.id;

    if (user_id) {
      const {data, error} = await supabase.rpc("get_conversations", {
        user_id,
      });

      if (error) {
        console.log(error);
      }
      return data;
    }
  }

  // const texts = data.forEach((e: any) => {
  //   return e.text;
  // });

  // console.log(texts);
  return [];
};

export const getConversation = async (id: string, from = 0, to = MSGS_PER_PAGE) => {
  const supabase = createSupabaseServerClient();

  const {data, error} = await supabase
    .from("conversations")
    .select("*,from_user:from(username, avatar),reply_content:reply_to(reply_user:from(username,avatar),text)")
    .eq("conversation_id", id)
    .range(from, to)
    .order("created_at", {ascending: false});

  if (error) {
    return [];
    console.log(error);
  }

  return data;
};

export const startConversation = async (to: string, text: string) => {
  const supabase = createSupabaseServerClient();
  const from = (await supabase.auth.getUser()).data.user?.id;

  const id = uuidv4();
  const {data: selectData} = await supabase
    .from("conversations")
    .select("conversation_id")
    .or(`from.eq.${from}, to.eq.${from}`);

  if (selectData && selectData?.length > 0) {
    const {error} = await supabase
      .from("conversations")
      .insert([{to, text, conversation_id: selectData[0].conversation_id}]);
    return JSON.stringify({url: `/conversations/${selectData[0].conversation_id}`});
  }

  const {data, error} = await supabase
    .from("conversations")
    .insert([{id, to, text, reply_to: id}])
    .select("conversation_id")
    .single();
  if (data) {
    return JSON.stringify({url: `/conversations/${data.conversation_id}`});
  }

  console.log(error);
  return JSON.stringify({error: "Something went wrong", variant: "destructive"});
};

export const sendPrivateMsg = async (id: string, text: string, msg: MessagesType) => {
  const supabase = createSupabaseServerClient();

  const conversation_id = msg.conversation_id;
  const from = (await supabase.auth.getUser()).data.user?.id;
  const to = msg.from == from ? msg.to : msg.from;

  const {error} = await supabase.from("conversations").insert([{id, to, text, conversation_id, reply_to: id}]);

  if (error) {
    console.log(error);
    return JSON.stringify({error: "Something went wrong", variant: "destructive"});
  }

  return JSON.stringify({success: ""});
};

export const updatePrivateMsg = async (text: string, id: string) => {
  const supabase = createSupabaseServerClient();

  const from = (await supabase.auth.getUser()).data.user?.id;
  const updated_at = getTimeStampz();
  const {error} = await supabase.from("conversations").update({text, updated_at}).eq("from", from).eq("id", id);

  if (error) {
    console.log(error);
    return JSON.stringify({error: "Something went wrong", variant: "destructive"});
  }

  return JSON.stringify({success: ""});
};

export const replyPrivateMsg = async (id: string, text: string, reply_to: string, msg: MessagesType) => {
  const supabase = createSupabaseServerClient();
  const conversation_id = msg.conversation_id;
  const from = (await supabase.auth.getUser()).data.user?.id;
  const to = msg.from == from ? msg.to : msg.from;

  const {error} = await supabase.from("conversations").insert([{id, text, reply_to, conversation_id, to}]);

  if (error) {
    console.log(error);
    return JSON.stringify({error: "Something went wrong", variant: "destructive"});
  }

  return JSON.stringify({success: ""});
};

export const deleteMsgConversation = async (id: string) => {
  const supabase = createSupabaseServerClient();
  const {error} = await supabase.from("conversations").delete().eq("id", id);

  if (error) {
    return JSON.stringify({error: ""});
  }
  return JSON.stringify({success: ""});
};
