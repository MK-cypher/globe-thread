"use server";

import createSupabaseServerClient from "@/lib/db/server";
import configureCloudinary from "@/lib/uploader";

export const getAllPosts = async () => {
  const supabase = createSupabaseServerClient();
  const {data, error} = await supabase.from("posts").select("*,users(avatar,username)");
  if (error) {
    console.log(error);
    return [];
  }

  return data;
};

export const getPosts = async (type: any) => {
  const supabase = createSupabaseServerClient();
  const {data, error} = await supabase
    .from("posts")
    .select("*,users(avatar,username)")
    .or(`type.eq.${type[0]},type.eq.${type[1]}`);

  return data;
};

export const savePost = async (data: any, id: number | undefined, oldImg: string | undefined) => {
  const supabase = createSupabaseServerClient();
  const cloudinary = await configureCloudinary();

  if (oldImg && !data.img) {
    const imageId = oldImg.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(imageId);
  }

  if (data.img && data.img.startsWith("data")) {
    if (oldImg) {
      const imageId = oldImg.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(imageId);
    }
    const result = await cloudinary.uploader.upload(data.img, {
      upload_preset: process.env.CLOUD_PRESET,
      folder: `posts/`,
    });
    data.img = result.secure_url;
  }

  if (id) {
    const {error} = await supabase.from("posts").update([data]).eq("id", id);
    if (error) {
      console.log(error);
      return false;
    }
    return true;
  }

  const {error} = await supabase.from("posts").insert([data]);

  if (error) {
    console.log(error);
    return false;
  }

  return true;
};

export const deletePost = async (id: number) => {
  const supabase = createSupabaseServerClient();

  const {error} = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    console.log(error);
    return false;
  }

  return true;
};
