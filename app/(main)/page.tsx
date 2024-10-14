import {getAllPosts} from "@/actions/posts";
import {getUser} from "@/actions/users";
import FeaturePosts from "@/components/sections/FeaturePosts";
import Hero from "@/components/sections/Hero";
import React from "react";

export default async function page() {
  const user = await getUser();
  const posts = await getAllPosts();
  return (
    <div className="mt-20">
      <Hero user={user} />
      <FeaturePosts posts={posts} user={user} />
    </div>
  );
}
