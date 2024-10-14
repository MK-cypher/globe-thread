"use client";
import {getDayDateTime} from "@/lib/date";
import {getDevice} from "@/lib/utils";
import {Button, buttonVariants} from "../ui/button";
import Image from "next/image";
import {signOutAll} from "@/app/(auth)/actions";
import {toast} from "../ui/use-toast";
import {useState} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export default function SignoutOther() {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);

    const result = JSON.parse(await signOutAll());

    if (result.error) {
      toast({
        title: result.error,

        description: result?.description,
        variant: "destructive",
      });
    } else {
      toast({
        title: result.success,
        description: result?.description,
        variant: "success",
      });
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="text-lg font-semibold">Signout from other devices</div>
      <div className="bg-secondary/90 rounded-lg p-5 mb-5">
        <div className="text-sm text-muted-foreground mb-5">
          this action will allow you to signout from this account on every device while maintaining your login session
          on this one.
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger className={`${buttonVariants()}  ${loading ? "loading" : ""}`}>
              Log out from all devices <span></span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Are you sure you want to do this?</AlertDialogTitle>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
