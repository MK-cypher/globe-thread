"use client";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {sendPasswordReset} from "../actions";
import {cn} from "@/lib/utils";
import {AlertTriangle, ArrowLeft, CheckCircle2} from "lucide-react";
import Link from "next/link";

const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

interface message {
  status: boolean;
  message: string;
}

export default function page() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<message>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (emailFormat.test(email)) {
      const error = JSON.parse(await sendPasswordReset(email));

      if (error) {
        setMessage({
          status: false,
          message: "something went wrong please try again later",
        });
      } else {
        setMessage({
          status: true,
          message: "Password reset Link has been sent! Please Check your Email",
        });
      }
    } else {
      setMessage({status: false, message: "Invalid Email"});
    }
    setIsLoading(false);
  };

  return (
    <main className="flex justify-center  items-center min-h-lvh">
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
        <h3 className="text-2xl font-bold text-center mb-8">Enter Your Email</h3>
        <form
          onSubmit={(e: React.FormEvent) => {
            handleSubmit(e);
          }}
        >
          <input
            placeholder="Email"
            className="w-full"
            onChange={(e) => {
              setMessage({status: false, message: ""});
              setEmail(e.target.value);
            }}
          />
          <Button className={`w-full mt-8 ${isLoading ? "loading" : ""}`}>
            {" "}
            <span></span> Send
          </Button>
        </form>
      </div>
    </main>
  );
}
