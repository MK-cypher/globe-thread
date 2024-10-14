"use client";

import {Eye, EyeOff, UploadCloud} from "lucide-react";
import React, {useState} from "react";
import {profileSave, updatePassword} from "@/actions/users";
import {toast} from "@/components/ui/use-toast";
import {Button} from "./ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "./ui/tooltip";
export default function ProfileUpdate({userData}: {userData: any}) {
  const [loading, setLoading] = useState(false);
  const [newData, setnewData] = useState(userData);
  const [avatar, setAvatar] = useState<any>();

  const saveProfile = async () => {
    setLoading(true);
    if (!avatar) {
      const avatarData = null;
      const {error, succsess} = JSON.parse(await profileSave(newData, avatarData));
      if (error) {
        toast({
          title: error,
        });
      } else {
        toast({
          title: succsess,
          variant: "success",
        });
      }
      setLoading(false);
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(avatar);
      reader.onloadend = async () => {
        const formData = reader.result;
        const {error, succsess} = JSON.parse(await profileSave(newData, formData));
        if (error) {
          toast({
            title: error,
          });
        } else {
          toast({
            title: succsess,
            variant: "success",
          });
        }
        setLoading(false);
      };
    }
  };

  return (
    <>
      <div className="text-lg font-semibold">General Information</div>
      <div className="bg-secondary/90 rounded-lg p-5 mb-5">
        <div className=" my-2 px-2">
          <label htmlFor="avatar" className="text-muted-foreground mb-3">
            Profile Picture
          </label>
          <div className="flex items-center gap-3">
            <div className="relative avatar-wrapper w-[50px] h-[50px] rounded-full cursor-pointer">
              <label htmlFor="avatar" className="w-full h-full absolute top-0 left-0 cursor-pointer z-30"></label>
              <input
                type="file"
                id="avatar"
                className="opacity-0 absolute w-0 h-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0 && e.target.files[0].type.includes("image")) {
                    setAvatar(e.target.files[0]);
                  } else {
                    return;
                  }
                }}
                accept="image/*"
                name="avatar"
              />
              <UploadCloud
                className="avatar-drop absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                size={30}
              />
              <div className="w-full h-full cursor-pointer">
                <img
                  className="rounded-full object-cover w-full h-full"
                  src={avatar ? URL.createObjectURL(avatar) : newData.avatar ? newData.avatar : "/user.png"}
                  alt="avatar"
                />
              </div>
            </div>
            <div>
              <Button
                variant={"outline"}
                onClick={() => {
                  setAvatar(null);
                  setnewData((prev: any) => ({...prev, avatar: ""}));
                }}
              >
                Remove Profile Picture
              </Button>
            </div>
          </div>
        </div>
        <div className="flex max-sm:flex-col">
          <div className="my-3 space-y-2 sm:w-1/2 sm:px-2">
            <label htmlFor="full-name" className="text-muted-foreground">
              Full Name
            </label>
            <input
              className="w-full"
              id="full-name"
              placeholder="John Doe"
              value={newData.name || ""}
              readOnly={false}
              onChange={(e) => {
                setnewData((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />
          </div>
          <div className="my-3 space-y-2 sm:w-1/2 sm:px-2">
            <label htmlFor="email" className="text-muted-foreground">
              Email
            </label>
            <div className="flex items-center gap-2">
              <input
                disabled
                id="email"
                className="w-full disabled cursor-not-allowed"
                value={newData.email || ""}
                readOnly={true}
              />

              <Tooltip>
                <TooltipTrigger>
                  <label htmlFor="public_email">{newData.public_email ? <Eye /> : <EyeOff />}</label>
                </TooltipTrigger>
                <TooltipContent>Allow others to see your email in the profile page</TooltipContent>
              </Tooltip>
              <input
                className="absolute opacity-0"
                type="checkbox"
                name="public_email"
                id="public_email"
                readOnly={false}
                defaultChecked={newData.public_email}
                onChange={(e) => {
                  console.log(e.target.checked);
                  setnewData((prev: any) => ({...prev, public_email: e.target.checked}));
                }}
              ></input>
            </div>
          </div>
        </div>
        <div className="flex max-sm:flex-col">
          <div className="my-3 space-y-2 sm:w-1/2 sm:px-2">
            <label htmlFor="username" className="text-muted-foreground">
              Username
            </label>
            <input
              className="w-full"
              id="username"
              placeholder="johndoe123"
              value={newData.username || ""}
              readOnly={false}
              onChange={(e) => {
                setnewData((prev: any) => ({
                  ...prev,
                  username: e.target.value,
                }));
              }}
            />
          </div>
          <div className="my-3 space-y-2 sm:w-1/2 sm:px-2">
            <label htmlFor="title" className="text-muted-foreground">
              Title
            </label>
            <input
              className="w-full"
              id="title"
              placeholder="Software engineer"
              value={newData.title || ""}
              readOnly={false}
              onChange={(e) => {
                setnewData((prev: any) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
            />
          </div>
        </div>
        <div className="my-3 space-y-2 p-2">
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            placeholder="Junior web developer since 2020..."
            className="resize-none w-full h-40"
          ></textarea>
        </div>
        <div className="flex gap-3 mt-10">
          <button className={`save-btn ${loading ? "loading" : ""}`} onClick={saveProfile}>
            Update Profile
            <span></span>
          </button>
        </div>
      </div>
    </>
  );
}
