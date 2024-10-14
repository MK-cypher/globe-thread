"use server";

import createSupabaseServerClient from "@/lib/db/server";

export const getUserProfile = async (id: string) => {
  const supabase = createSupabaseServerClient();

  const {data: userData, error: userIdError} = await supabase
    .from("users")
    .select("id,username,title,email,avatar,banner,bio,skills,website,public_email,socials")
    .eq("public_id", id);

  if (userData?.length) {
    const userId = userData[0].id;

    const {data: posts, error} = await supabase
      .from("posts")
      .select("*,users(username,avatar)")
      .eq("created_by", userId);
    if (posts?.length) {
      return {user: userData[0], posts: posts};
    }
    return {user: userData[0], posts: []};
  }
  return {user: null, posts: []};
};
