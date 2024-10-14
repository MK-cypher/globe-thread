"use client";
import {PostType} from "@/lib/types";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import Avatar from "./ui/avatar";
import {Button, buttonVariants} from "./ui/button";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "./ui/dialog";
import Cookies from "js-cookie";
import {startConversation} from "@/actions/conversations";
import {toast} from "./ui/use-toast";

type props = {
  post: PostType;
  user: any;
};

export default function ContactBtn({post, user}: props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const textAreaRef = useRef<any>(null);
  const [open, setOpen] = useState(false);

  const submit = async () => {
    if (user) {
      console.log(post.id);
      const {url, error, variant} = JSON.parse(await startConversation(post.created_by, message));
      if (url) {
        router.push(url);
      } else {
        toast({
          title: error,
          variant,
        });
      }
      // send
    } else {
      Cookies.set("post-id", `${post.id}`);
      Cookies.set("post-msg", `${message}`);

      router.push(`/signin?origin=buy-sell`);
    }
    //
  };

  useEffect(() => {
    const postId = Cookies.get("post-id");
    const postMsg = Cookies.get("post-msg");

    if (postId) {
      Cookies.remove("post-id");
      Cookies.remove("post-msg");

      if (postId == `${post.id}` && post.created_by != user.id) {
        setMessage(postMsg || "");
        setOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = textarea.scrollHeight - 10;
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={buttonVariants()}>Contact</DialogTrigger>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle></DialogTitle>
          <div>
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 shrink-0 rounded-full">
                <Avatar img={post.users.avatar} className={"w-10 h-10 rounded-full"} />
              </div>
              <div className="">{post.users.username}</div>
            </div>
            <div className="line-clamp-2 mb-5">{post.title}</div>

            <div>
              <textarea
                name="chat-input"
                id="chat-input"
                placeholder="Your Message"
                className={`${
                  message && message.length >= 500 && "text-destructive"
                } min-h-2 max-h-32 resize-none w-full`}
                ref={textAreaRef}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                // onKeyDown={(e) => {
                //   if (e.key == "Enter" && !e.shiftKey) {
                //     e.preventDefault();
                //     submit();
                //   }
                // }}
                value={message}
                readOnly={false}
              />
            </div>
            <div
              className={`mt-1 flex justify-end ${
                message && message.length >= 500 && "text-destructive"
              } flex items-center gap-3`}
            >
              {message && message.length >= 500 && <div>Your message is too long</div>}
              {message.length} / 500
            </div>
            <div className="mt-5">
              <Button className={`w-full ${loading ? "loading" : ""}`} onClick={submit}>
                Send Your Message
                <span></span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
