"use client";
import GoogleIcon from "@/components/icons/GoogleIcon";
import {Button} from "@/components/ui/button";
import {signInOAuth} from "../actions";
import {toast} from "@/components/ui/use-toast";
import {useState} from "react";

export default function GoogleAuth({searchParams}: {searchParams: {[key: string]: string}}) {
  const [isLoading, setIsLoading] = useState(false);
  const origin = searchParams.origin;

  const handleOAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    const result = await signInOAuth(provider, origin || "");
    if (result) {
      const error = JSON.parse(result).error;
      toast({
        title: error,
      });
    }
    setIsLoading(false);
  };
  return (
    <Button
      onClick={() => {
        handleOAuth("google");
      }}
      className={`w-full my-3 flex items-center gap-2 ${isLoading ? "loading" : ""}`}
    >
      <span></span>
      <GoogleIcon width={20} height={20} />
      <div>google</div>
    </Button>
  );
}
