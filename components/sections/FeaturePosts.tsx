import {PostType} from "@/lib/types";
import React from "react";
import PostBox from "../PostBox";
import {User} from "@supabase/supabase-js";

type props = {
  posts: PostType[] | [];
  user: User;
};

export default function FeaturePosts({posts, user}: props) {
  return (
    <div className="mt-20 container">
      <div className="text-primary text-xl font-semibold mb-5">Most Recent</div>
      {posts.map((item, i) => (
        <div key={i}>
          <PostBox post={item} user={user} />
        </div>
      ))}
    </div>
  );
}
