"use client";
import {PostType} from "@/lib/types";
import CreatePost from "./CreatePost";

export default function PostsActions({type, post}: {type: string; post?: PostType}) {
  return (
    <div className="w-full">
      <div className="max-xmd:ml-32 flex flex-wrap justify-between items-center gap-2 max-[580px]:ml-0 max-[580px]:flex-col ">
        <div className="max-[580px]:self-end">
          <CreatePost type={type} post={post} />
        </div>
        <div className="max-[580px]:w-full">
          <input type="search" placeholder="search..." className="max-[580px]:w-full" />
        </div>
      </div>
    </div>
  );
}
