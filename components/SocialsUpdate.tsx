"use client";
import React, {useEffect, useState} from "react";
import {toast} from "./ui/use-toast";
import {socialSave} from "@/actions/users";
import Facebook from "@/components/icons/Facebook";
import Instagram from "@/components/icons/Instagram";
import Linkedin from "@/components/icons/Linkedin";
import X from "@/components/icons/X";

type socialType = {
  link: string;
  social: "X" | "Linkedin" | "Facebook" | "Instagram";
};

export default function SocialsUpdate({socials}: {socials: any}) {
  const [loading, setLoading] = useState(false);
  const [newSocials, setNewSocials] = useState<socialType[]>([
    {
      link: socials?.find((item: any) => item.social == "X")?.link || "",
      social: "X",
    },
    {
      link: socials?.find((item: any) => item.social == "Linkedin")?.link || "",
      social: "Linkedin",
    },
    {
      link: socials?.find((item: any) => item.social == "Facebook")?.link || "",
      social: "Facebook",
    },
    {
      link: socials?.find((item: any) => item.social == "Instagram")?.link || "",
      social: "Instagram",
    },
  ]);

  const socialIcons = {X: X, Linkedin: Linkedin, Facebook: Facebook, Instagram: Instagram};

  const saveSocials = async () => {
    console.log(newSocials);
    setLoading(true);
    const {error, success} = JSON.parse(await socialSave(newSocials));
    if (error) {
      toast({
        title: error,
      });
    } else {
      toast({
        title: success,
        variant: "success",
      });
    }
    setLoading(false);
  };
  return (
    <>
      <div className="text-lg font-semibold">Socials</div>
      <div className="bg-secondary/90 rounded-lg p-5">
        <div>
          {newSocials.map((item, i) => {
            const Icon = socialIcons[item.social];
            return (
              <div key={item.social} className="flex items-center gap-2 my-5 ">
                <div className={item.social == "X" ? "px-1.5" : ""}>
                  <Icon width={item.social == "X" ? 20 : 30} height={item.social == "X" ? 20 : 30} />
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    className="w-full"
                    placeholder={
                      item.social == "Instagram"
                        ? "https://www.instagram.com/username"
                        : item.social == "X"
                        ? "https://x.com/username"
                        : item.social == "Facebook"
                        ? "https://www.facebook.com/username"
                        : "https://www.linkedin.com/in/usernmae"
                    }
                    defaultValue={newSocials.find((social) => social.social == item.social)?.link}
                    readOnly={false}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewSocials([
                        ...newSocials.map((social, i) =>
                          social.social == item.social ? {...social, link: value} : social
                        ),
                      ]);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-10">
          <button className={`save-btn ${loading ? "loading" : ""}`} onClick={saveSocials}>
            Update Socials
            <span></span>
          </button>
        </div>
      </div>
    </>
  );
}
