import React from "react";
import {Button, buttonVariants} from "../ui/button";
import {ArrowRight} from "lucide-react";
import Link from "next/link";

export default function Hero({user}: {user: any}) {
  return (
    <div className="flex justify-center items-center mt-28 container">
      <div className="w-full">
        <div className="text-5xl font-semibold mb-2 max-w-[750px] text-center mx-auto">
          Connecting You to the World’s Opportunities
        </div>
        <div className="text-muted-foreground max-w-[550px] mx-auto text-center">
          Whether you're searching for a job, talent, or the next big product, <br /> our global network bridges the
          gap. Discover, connect, and achieve with ease wherever you are.
        </div>
        <div className="flex justify-center items-center mt-5">
          {user ? (
            <Link href={`/global-chat`} className={`${buttonVariants()} gap-2 `}>
              Global Chat <ArrowRight size={18} />
            </Link>
          ) : (
            <Link href={`/signup`} className={`${buttonVariants()}`}>
              Join Now!
            </Link>
          )}
        </div>
        <div className="flex justify-center items-center">
          <Link href={"/jobs-hiring"} className="w-1/2 p-5 ">
            <div className="border border-foreground/10 shadow-md hover:shadow-xl rounded-lg flex justify-center items-center p-5">
              Jobs / Hiring
            </div>
          </Link>
          <Link href={"/buy-sell"} className="w-1/2 p-5 ">
            <div className="border border-foreground/10 shadow-md hover:shadow-xl rounded-lg flex justify-center items-center p-5">
              Buying / Selling
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
