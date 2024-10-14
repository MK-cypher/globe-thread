import {timeDif} from "@/lib/datesFormats";
import {PostType} from "@/lib/types";
import {Heart} from "lucide-react";
import ContactBtn from "./ContactBtn";
import WishlistBtn from "./WishlistBtn";

type props = {
  post: PostType;
  user: any;
};

export default function PostBox({post, user}: props) {
  return (
    <div
      className={`${
        post.type == "Selling" || post.type == "Jobs" ? "border-emerald-500" : "border-blue-500"
      } bg-secondary rounded-lg p-2 border-l-4`}
    >
      <div
        className={`${
          post.type == "Selling" || post.type == "Jobs" ? "text-emerald-500" : "text-blue-500"
        } mb-2 opacity-70`}
      >
        {post.type == "Jobs" ? "Looking For Job" : post.type}
      </div>
      <div className={`flex max-sm:flex-col items-stretch gap-5`}>
        <div className="flex gap-5">
          {post.img && (
            <div className="w-40 h-40 rounded-lg shrink-0">
              <img src={post.img} alt="post" className="w-40 h-40 rounded-lg object-cover" />
            </div>
          )}
          <div className="sm:hidden">
            <div className="text-sm text-primary font-semibold mb-1">{timeDif(post.created_at)}</div>
            <div className="font-semibold mb-2">{post.title}</div>
          </div>
        </div>
        <div className="flex max-sm:flex-col justify-between items-stretch w-full">
          <div className="flex flex-col justify-between sm:pr-2 max-sm:pb-2">
            <div>
              <div className="text-sm text-primary font-semibold mb-1 max-sm:hidden">{timeDif(post.created_at)}</div>
              <div className="font-semibold mb-2 max-sm:hidden">{post.title}</div>
              <div className="text-muted-foreground">{post.description}</div>
            </div>
          </div>
          <div className="flex sm:flex-col sm:justify-between justify-center items-center gap-5 sm:px-5 max-sm:py-5 max-sm:border-t sm:border-l border-foreground/20">
            <div className="sm:flex sm:flex-col sm:justify-center sm:items-center">
              <div className="w-8 h-8 rounded-full">
                <img src={post.users.avatar} alt="user" className="w-8 h-8 rounded-full" />
              </div>
              <div>{post.users.username}</div>
            </div>
            <div className="font-semibold max-sm:mr-auto">
              {post?.price
                ? `$${post?.price}${post.price_type == "salary" ? "k/year" : post.price_type == "perhour" ? "/h" : ""}`
                : ""}
            </div>
            <div>{user && <WishlistBtn wishlist={[]} id={post.id} />}</div>
            {user?.id != post.created_by && <ContactBtn user={user} post={post} />}
          </div>
        </div>
      </div>
    </div>
  );
}
