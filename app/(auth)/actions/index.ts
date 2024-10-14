"use server";

import createSupabaseServerClient from "@/lib/db/server";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

interface formData {
  username?: string;
  emailAddress: string;
  password: string;
  confirmPassword?: string;
}

export async function signInOAuth(provider: any, origin: string) {
  const supabase = createSupabaseServerClient();
  const {error, data} = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?origin=${origin}`,
    },
  });
  if (!error) {
    redirect(data.url);
  } else {
    return JSON.stringify({error: "something went wrong!"});
  }
}

export async function checkUsername(username: string) {
  const supabase = createSupabaseServerClient();
  const {data: exist, error: existError} = await supabase.from("users").select("username").eq("username", username);
  if (exist?.length) {
    return true;
  }
  return false;
}

export async function signUpEmail(data: formData) {
  const supabase = createSupabaseServerClient();

  if (data.password === data.confirmPassword) {
    const origin = headers().get("origin");
    const exist = await checkUsername(data.username!);
    if (exist) {
      return JSON.stringify({error: "username already exist! try to sign in"});
    }

    const result = await supabase.auth.signUp({
      email: data.emailAddress,
      password: data.password,
      options: {
        data: {
          name: data.username,
          email: data.emailAddress,
          avatar_url: null,
          role: "user",
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (result.data.user?.identities?.length == 0) {
      return JSON.stringify({error: "email already exist! try to sign in"});
    } else if (result.error) {
      console.log(result.error);
      return JSON.stringify({
        error: "Somethin went wrong! Please try again in a moment",
      });
    } else {
      return JSON.stringify({error: null});
    }
  } else {
    return JSON.stringify({error: "Password do not match"});
  }
}

export async function signInWithEmail(data: formData) {
  const supabase = createSupabaseServerClient();
  const result = await supabase.auth.signInWithPassword({
    email: data.emailAddress,
    password: data.password,
  });
  if (result.error?.message == "Invalid login credentials") {
    return JSON.stringify({
      error: "Invalid Email or Password! Please check your credentials",
    });
  } else if (result.error?.message) {
    console.log(result.error);
    return JSON.stringify({
      error: "Something ent wrong! Please try again in a moment",
    });
  } else {
    return redirect("/dashboard");
  }
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  const {error} = await supabase.auth.signOut({scope: "local"});
  if (!error) {
    return JSON.stringify({success: ""});
  } else {
    return JSON.stringify({error: "something went wrong"});
  }
}

export async function signOutAll() {
  const supabase = createSupabaseServerClient();
  const {error} = await supabase.auth.signOut({scope: "others"});
  if (!error) {
    return JSON.stringify({success: "You have been signed out from all other devices"});
  } else {
    return JSON.stringify({error: "something went wrong"});
  }
}

export async function sendPasswordReset(email: string) {
  const supabase = createSupabaseServerClient();

  // TODO
  // check if email exists

  const origin = headers().get("origin");
  const {error} = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.SITE_URL}/update-password`,
  });

  console.log(error);

  return JSON.stringify(error);
}

export async function resetPassword(password: string, code: string) {
  const supabase = createSupabaseServerClient();

  try {
    const {error} = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return JSON.stringify({
        error: "The reset Link has expired!",
      });
    }
    const {error: error2} = await supabase.auth.updateUser({
      password: password,
    });

    if (error2) {
      return JSON.stringify({
        error: "Could not Update the Password! try again later",
      });
    }
    return JSON.stringify({error: null});
  } catch (e) {
    console.log(e);
    return JSON.stringify({error: "Something went wrong"});
  }
}
