import {User2Icon} from "lucide-react";
import React from "react";
import {ClassNameValue} from "tailwind-merge";

export default function Avatar({img, alt, className}: {img: string; alt?: string; className?: ClassNameValue}) {
  return (
    <div className={`outline outline-1 outline-foreground/60 ${className}`}>
      {img ? <img src={img} alt={alt || "img"} className={`${className}`} /> : <User2Icon />}
    </div>
  );
}
