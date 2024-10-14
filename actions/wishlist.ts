"use server";

import createSupabaseServerClient from "@/lib/db/server";
import {revalidatePath} from "next/cache";

export const getWishlist = async () => {
  const supabase = createSupabaseServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const {error, data} = await supabase.from("wishlist").select("posts").eq("created_by", userId);

  if (data?.length) {
    const posts = data[0].posts;
    return posts;
  }
  return [];
};

export const getWishlistPosts = async () => {
  const supabase = createSupabaseServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const {data: list} = await supabase.from("wishlist").select("posts").eq("created_by", userId);

  const {data, error} = await supabase
    .from("posts")
    .select("*")
    .in("id", list?.length ? list[0].posts : []);

  if (data?.length && list?.length) {
    return {wishlist: list[0].posts, posts: data};
  }
  console.log(error);
  return {wishlist: [], posts: []};
};

export const addWishlist = async (id: number) => {
  const supabase = createSupabaseServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const {error, data} = await supabase.from("wishlist").select("posts").eq("created_by", userId);
  if (data?.length) {
    const posts = data[0].posts;
    if (posts.includes(id)) {
      return true;
    }
    posts.push(id);
    const {error: err} = await supabase.from("wishlist").update({posts}).eq("created_by", userId);
    if (!err) {
      revalidatePath("/saved-posts");
      return true;
    }
    console.log(err);
  }
  console.log(error);
  return false;
};

export const removeWishlist = async (id: number) => {
  const supabase = createSupabaseServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const {error, data} = await supabase.from("wishlist").select("posts").eq("created_by", userId);
  if (data?.length) {
    const posts = data[0].posts;
    const index = posts.indexOf(`${id}`);
    if (index < -1) {
      return true;
    }
    posts.splice(index, 1);
    const {error: err} = await supabase.from("wishlist").update({posts}).eq("created_by", userId);
    if (!err) {
      revalidatePath("/saved-posts");
      return true;
    }
    console.log(err);
  }
  console.log(error);
  return false;
};
