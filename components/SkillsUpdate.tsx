"use client";
import React, {useState} from "react";
import {toast} from "./ui/use-toast";
import {skillsSave} from "@/actions/users";
import {Button} from "./ui/button";
import {X} from "lucide-react";

export default function SkillsUpdate({skills}: {skills: any}) {
  const [loading, setLoading] = useState(false);
  const [newSkills, setNewSkills] = useState(skills || []);
  const [skillInput, setSkillInput] = useState("");
  // console.log(skills);

  const saveSkills = async () => {
    setLoading(true);
    const {error, success} = JSON.parse(await skillsSave(newSkills));
    console.log(error, success);
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
      <div className="text-lg font-semibold">Skills</div>
      <div className="bg-secondary/90 rounded-lg p-5 mb-5">
        <div className="my-3 space-y-2">
          <label htmlFor="full-name" className="text-muted-foreground">
            Skill
          </label>
          <div className="flex items-center gap-3">
            <input
              className="w-full"
              id="full-name"
              placeholder="UI/UX designer"
              onChange={(e) => {
                setSkillInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (!newSkills.includes(skillInput) && e.key == "Enter" && !e.shiftKey) {
                  setNewSkills((prev: any) => [...prev, skillInput]);
                }
              }}
            />
            <Button
              onClick={(e) => {
                if (!newSkills.includes(skillInput)) {
                  setNewSkills((prev: any) => [...prev, skillInput]);
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>
        {newSkills?.length ? (
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              {newSkills.map((item: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-1 rounded-full px-2 py-0.5 border whitespace-nowrap border-foreground/30"
                >
                  <div>{item}</div>
                  <div
                    className="text-red-500 cursor-pointer"
                    onClick={() => {
                      setNewSkills(newSkills.filter((skill: string) => skill != item));
                    }}
                  >
                    <X />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="flex gap-3 mt-10">
          <button className={`save-btn ${loading ? "loading" : ""}`} onClick={saveSkills}>
            Update Skills
            <span></span>
          </button>
        </div>
      </div>
    </>
  );
}
