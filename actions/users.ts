"use server";

import {supabaseAdmin} from "@/lib/db/admin";
import createSupabaseServerClient from "@/lib/db/server";
import configureCloudinary from "@/lib/uploader";
import {revalidatePath} from "next/cache";

export const getUser = async () => {
  const supabase = createSupabaseServerClient();
  const {data, error} = await supabase.auth.getUser();
  if (!error) {
    const id = data.user?.id;

    const result = (await supabase.from("users").select("*").eq("id", id).single()).data;

    return result;
  }
  return null;
};

export const saveEmail = async (email: string) => {
  const supabase = createSupabaseServerClient();

  const {data} = await supabase.from("subscriptions").select("email").eq("email", email);
  if (data && data?.length > 0) {
    return JSON.stringify({error: "Email Already Exist"});
  }

  const {error} = await supabase.from("subscriptions").insert({email});
  if (error) {
    return JSON.stringify({error: "Something went wrong"});
  }
  return JSON.stringify({success: "Your Email has been saved succsessfully"});
};

export const socialSave = async (socials: any) => {
  const supabase = createSupabaseServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const {error} = await supabase.from("users").update({socials}).eq("id", userId);

  if (error) {
    return JSON.stringify({error: "Something went wrong"});
  }
  return JSON.stringify({success: "Information have been saved succsessfully"});
};

export const skillsSave = async (skills: string[]) => {
  const supabase = createSupabaseServerClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const {error} = await supabase.from("users").update({skills}).eq("id", userId);

  if (error) {
    console.log(error);
    return JSON.stringify({error: "Something went wrong"});
  }
  return JSON.stringify({success: "Information have been saved succsessfully"});
};

export const profileSave = async (userData: any, avatarData: string | ArrayBuffer | null) => {
  const cloudinary = await configureCloudinary();
  const dbuserData = await getUser();
  let avatarUrl: string = dbuserData.avatar;
  if (typeof avatarData == "string") {
    const imageId = avatarUrl.split("/").slice(-3).join("/").split(".")[0];
    if (imageId) {
      const deleteResult = await cloudinary.uploader.destroy(imageId);
    }
    const result = await cloudinary.uploader.upload(avatarData, {
      upload_preset: process.env.CLOUD_PRESET,
      folder: `${userData.id}/avatar`,
    });
    avatarUrl = result.secure_url;
  }
  const username = userData.username;
  const name = userData.name;
  const title = userData.title;
  const public_email = userData.public_email;
  const supabase = await supabaseAdmin();
  const {error} = await supabase
    .from("users")
    .update({username, avatar: avatarUrl, name, title, public_email})
    .eq("id", dbuserData.id);
  if (error) {
    console.log(error);
    return JSON.stringify({error: "Something went wrong!"});
  } else {
    revalidatePath(`${process.env.SITE_URL}/settings`);
    return JSON.stringify({
      succsess: "Profile changes have been saved succsessfully!",
    });
  }
};

export const updatePassword = async (password: any) => {
  if (password.newPassword == password.confirmPassword) {
    if (password.newPassword.length >= 6 && password.newPassword.length <= 30) {
      const supabase = createSupabaseServerClient();
      const current_plain_password = password.password;
      const new_plain_password = password.newPassword;
      const {error, data} = await supabase.rpc("change_user_password", {
        current_plain_password,
        new_plain_password,
      });

      if (!error && data == "success") {
        return JSON.stringify({
          success: "Password has been updated succsessfully",
        });
      }
      if (!error && data == "incorrect") {
        return JSON.stringify({
          error: "incorrect password",
        });
      }
      console.log(error);
      return JSON.stringify({
        error: "Something went wrong!",
      });
    } else {
      return JSON.stringify({
        error: "Password must be between 6 and 30 characters",
      });
    }
  } else {
    return JSON.stringify({error: "Password do not match"});
  }
};
