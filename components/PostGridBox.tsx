import {timeDif} from "@/lib/datesFormats";
import {PostType} from "@/lib/types";
import React from "react";
import ContactBtn from "@/components/ContactBtn";
import WishlistBtn from "@/components/WishlistBtn";

export default function PostGridBox({post, userData, wishlist}: {post: PostType; userData: any; wishlist: number[]}) {
  return (
    <div className="bg-secondary rounded-lg overflow-hidden">
      <div className="w-full">
        <img src={post.img} alt="post" className=" object-cover overflow-clip aspect-video" />
      </div>
      <div className="p-3">
        <div className="text-sm text-primary font-semibold mb-1">{timeDif(post.created_at)}</div>
        <div className="font-bold">{post.title}</div>
        <div className="text-muted-foreground">{post.description}</div>
      </div>
      <div className="flex justify-between posts-center p-3 border-t border-foreground/10">
        <div>
          {post?.price
            ? `$${post?.price}${post.price_type == "salary" ? "k/year" : post.price_type == "perhour" ? "/h" : ""}`
            : ""}
        </div>
        <div className="flex posts-center gap-3">
          {userData && <WishlistBtn wishlist={wishlist} id={post.id} />}
          {userData?.id != post.created_by && <ContactBtn user={userData} post={post} />}
        </div>
      </div>
    </div>
  );
}
