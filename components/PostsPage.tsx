"use client";
import {PostType} from "@/lib/types";
import React, {useState} from "react";
import PostsActions from "./PostsActions";
import PostBox from "./PostBox";
import {useUser} from "@/context/userContext";

type props = {
  posts: PostType[];
  type: string;
};

export default function PostsPage({posts, type}: props) {
  const user = useUser();
  return (
    <div className="relative w-full space-y-5">
      {user && <PostsActions type={type} />}
      <div className={`space-y-5`}>
        {posts.map((item) => (
          <div key={item.id}>
            <PostBox post={item} user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}
