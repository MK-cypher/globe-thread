"use server";

import {MSGS_PER_PAGE} from "@/lib/consts";
import createSupabaseServerClient from "@/lib/db/server";
import {getDateNow, getTimeStampz} from "@/lib/utils";

export const getMessages = async (from = 0, to = MSGS_PER_PAGE) => {
  const supabase = createSupabaseServerClient();

  const {data, error} = await supabase
    .from("chat")
    .select("*,from_user:from(username,avatar),reply_content:reply_to(reply_user:from(username,avatar),text)")
    .range(from, to)
    .order("created_at", {ascending: false});

  if (error) {
    console.log(error);
    return [];
  }
  return data;
};

export const sendPublicMsg = async (id: string, text: string) => {
  const supabase = createSupabaseServerClient();
  const user_id = (await supabase.auth.getUser()).data.user?.id;
  const {data: public_id} = await supabase.from("users").select("public_id").eq("id", user_id);

  const {error} = await supabase.from("chat").insert([{id, reply_to: id, text, public_id}]);

  if (error) {
    console.log(error);
    return JSON.stringify({error: "Something went wrong", variant: "destructive"});
  }

  return JSON.stringify({success: ""});
};

export const updatePublicMsg = async (text: string, id: string) => {
  const supabase = createSupabaseServerClient();

  const from = (await supabase.auth.getUser()).data.user?.id;
  const updated_at = getTimeStampz();
  const {error} = await supabase.from("chat").update({text, updated_at}).eq("from", from).eq("id", id);

  if (error) {
    console.log(error);
    return JSON.stringify({error: "Something went wrong", variant: "destructive"});
  }

  return JSON.stringify({success: ""});
};

export const replyPublicMsg = async (id: string, text: string, reply_to: string) => {
  const supabase = createSupabaseServerClient();

  const {error} = await supabase.from("chat").insert([{id, text, reply_to}]);

  if (error) {
    console.log(error);
    return JSON.stringify({error: "Something went wrong", variant: "destructive"});
  }

  return JSON.stringify({success: ""});
};

export const deleteMsg = async (id: string) => {
  const supabase = createSupabaseServerClient();

  const {error} = await supabase.from("chat").delete().eq("id", id);

  if (error) {
    console.log(error);
    return JSON.stringify({error: "Something went wrong", variant: "destructive"});
  }

  return JSON.stringify({success: ""});
};
