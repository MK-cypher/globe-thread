import {getUserProfile} from "@/actions/profile";
import {getUser} from "@/actions/users";
import {getWishlist} from "@/actions/wishlist";
import ContactBtn from "@/components/ContactBtn";
import Facebook from "@/components/icons/Facebook";
import Instagram from "@/components/icons/Instagram";
import Linkedin from "@/components/icons/Linkedin";
import X from "@/components/icons/X";
import PostGridBox from "@/components/PostGridBox";
import WishlistBtn from "@/components/WishlistBtn";
import {timeDif} from "@/lib/datesFormats";
import {ArrowUpRight, UserCircle2} from "lucide-react";
import Link from "next/link";

export default async function page({params: {id}}: {params: {id: string}}) {
  const userData = await getUser();
  const {user, posts} = await getUserProfile(id);
  const wishlist = await getWishlist();

  if (!user) {
    return <div>nothing here</div>;
  }

  const socialIcons = {X: X, Linkedin: Linkedin, Facebook: Facebook, Instagram: Instagram};
  return (
    <div>
      <div className="h-[20svh]">
        <img src={`${user.banner ? user.banner : "/banner.png"}`} alt="banner" className="w-full h-full object-cover" />
      </div>
      <div className="container flex gap-5">
        <div className="-mt-10 w-32 h-32 relative bg-background p-1 rounded-full">
          {user.avatar ? (
            <img src={`${user.avatar}`} alt="user" className="w-full h-full shrink-0 rounded-full bg-background" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-background">
              <UserCircle2 className="w-32 h-32" strokeWidth={0.5} />
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="font-bold">{user.username}</div>
          <div className="font-semibold text-muted-foreground">{user.title}</div>
        </div>
      </div>
      <div className="flex items-start gap-10 max-sm:flex-col container mt-10">
        <div className="container p-4 bg-secondary rounded-lg">
          <div className="font-bold">About me</div>
          <div className="max-w-[700px] text-start text-muted-foreground">{user.bio || "Nothing here."}</div>
        </div>
        <div className="w-[350px] max-md:w-[200px] max-sm:w-full bg-secondary p-4 rounded-lg shrink-0">
          <div className="font-semibold mb-2">Skills</div>
          {user.skills?.length ? (
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                {user.skills.map((item: string, i: number) => (
                  <div key={i} className="rounded-full px-2 py-0.5 border whitespace-nowrap border-foreground/30">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>No skills.</div>
          )}
          <div className="font-semibold mb-2 mt-7">Website</div>
          {user.website ? (
            <Link href={"/"} className="flex items-center gap-3 text-blue-500">
              <div>{user.website}</div>
              <ArrowUpRight />
            </Link>
          ) : (
            <div>No website.</div>
          )}
          {user.public_email && (
            <div>
              <div className="font-semibold mb-2 mt-7">Email</div>
              <div className="flex items-center gap-3">
                <div>{user.email}</div>
              </div>
            </div>
          )}
          <div className="font-semibold mb-2 mt-7">Socials</div>
          <div className="flex items-center gap-3">
            {user.socials?.length ? (
              user.socials.map(
                (item: {link: string; social: "X" | "Linkedin" | "Facebook" | "Instagram"}, i: number) => {
                  const Icon = socialIcons[item.social];
                  return (
                    <Link href={item.link} key={i}>
                      <Icon width={item.social == "X" ? 20 : 30} height={item.social == "X" ? 20 : 30} />
                    </Link>
                  );
                }
              )
            ) : (
              <div>No socials.</div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10 container">
        <div className="font-semibold">Posts</div>
        {posts.length ? (
          <div className="mt-5 grid-autofill">
            {posts.map((item, i) => (
              <PostGridBox wishlist={wishlist} userData={userData} post={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="text-center">{user.username} doesn't have any posts yet</div>
        )}
      </div>
    </div>
  );
}
