"use client";

import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {AlertTriangle, ArrowLeft, CheckCircle2} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {resetPassword} from "../actions";

interface message {
  status: boolean;
  message: string;
}

export default function ResetPass({searchParams}: {searchParams: {[key: string]: string}}) {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<message>();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(searchParams.code);
    setIsLoading(true);
    if (password.length >= 6) {
      if (password === confirmpassword) {
        if (searchParams.code) {
          const {error} = JSON.parse(await resetPassword(password, searchParams.code));
          if (error) {
            setMessage({
              status: false,
              message: error,
            });
          } else {
            setMessage({
              status: true,
              message: "Password has been successfully reset",
            });
            router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/`);
          }
        }
      } else {
        setMessage({status: false, message: "Password do not match"});
      }
    } else {
      setMessage({
        status: false,
        message: "Password must have least 6 characters",
      });
    }
    setIsLoading(false);
  };

  return (
    <main className="flex justify-center items-center min-h-lvh">
      <div
        className={cn(
          `${!message?.status ? "bg-red-300 text-red-700 " : "bg-emerald-500/15 text-emerald-500"} ${
            !message?.message ? "hidden" : "flex"
          } items-center justify-center gap-3 p-3 absolute rounded-lg w-fit top-[150px] left-1/2 transform -translate-x-1/2`
        )}
      >
        {!message?.status ? <AlertTriangle /> : <CheckCircle2 />}
        {message?.message}
      </div>
      <div className="w-[450px] p-10 bg-secondary rounded-lg inner-shadow text-center">
        <Link href="/signin" className="flex items-center gap-1 text-start mb-5 w-fit">
          <ArrowLeft /> back
        </Link>
        <h3 className="text-2xl font-bold text-center mb-8">Change Your Password</h3>
        <form
          onSubmit={(e: React.FormEvent) => {
            handleSubmit(e);
          }}
        >
          <input
            className="mb-3 w-full"
            placeholder="New Password"
            onChange={(e) => {
              setMessage({status: false, message: ""});
              setPassword(e.target.value);
            }}
          />
          <input
            placeholder="Confirm Password"
            className="w-full"
            onChange={(e) => {
              setMessage({status: false, message: ""});
              setConfirmPassword(e.target.value);
            }}
          />
          <Button className={`w-full mt-8 ${isLoading ? "loading" : ""}`}>
            <span></span> Send
          </Button>
        </form>
      </div>
    </main>
  );
}
