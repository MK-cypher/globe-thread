"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "../ui/button";
import {Facebook, Instagram, Twitter} from "lucide-react";
import {useState} from "react";
import {saveEmail} from "@/actions/users";
import {toast} from "../ui/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const submit = async () => {
    setLoading(true);
    const res = JSON.parse(await saveEmail(email));
    if (res.error) {
      toast({
        title: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: res.success,
        variant: "success",
      });
    }
    setLoading(false);
  };
  return (
    <>
      {!pathname.startsWith("/account") && !pathname.startsWith("/settings") ? (
        <div className="container py-5 border-t border-border/60 mt-10">
          <div className="flex justify-center items-center gap-2 mb-10">
            <div className="text-2xl text-primary font-bold">Globe Thread</div>
          </div>
          <div className="flex gap-10 items-start justify-between max-sm:flex-col">
            <div className="flex items-start gap-10">
              <div>
                <div className="font-semibold mb-3 uppercase">HELP</div>
                <div className="text-muted-foreground space-y-1">
                  <div>
                    <Link href={"/contact"} className="link">
                      Contact
                    </Link>
                  </div>
                  <div>
                    <Link href={"/faq"} className="link">
                      FAQ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-sm:w-full">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2 max-sm:w-full">
                  <input
                    type="text"
                    placeholder="Your Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="max-sm:w-full"
                  />
                  <Button onClick={submit} className={`${loading ? "loading" : ""}`}>
                    Subscribe <span></span>
                  </Button>
                </div>
                <div className="text-muted-foreground">Subscribe to recieve important news</div>
              </div>
              <div className="flex sm:justify-end max-sm:justify-center items-center gap-5">
                <Link href={"#"}>
                  <Facebook />
                </Link>
                <Link href={"#"}>
                  <Instagram />
                </Link>
                <Link href={"#"}>
                  <Twitter />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-10 mb-5 flex justify-between items-center max-sm:flex-col gap-4">
            <div>&copy;2024 ShopWave, Inc. All Rights Reserved</div>
            <div className="text-muted-foreground flex items-center gap-3">
              <div>
                <Link href={"/privacy-policy"} className="link">
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link href={"/terms-of-service"} className="link">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
