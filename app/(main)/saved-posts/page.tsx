import {getUser} from "@/actions/users";
import {getWishlistPosts} from "@/actions/wishlist";
import PostGridBox from "@/components/PostGridBox";

export default async function page() {
  const {posts, wishlist} = await getWishlistPosts();
  const userData = await getUser();

  return (
    <div className="container">
      <div className="text-lg font-bold">Saved Posts</div>
      <div className="mt-10">
        {posts.length ? (
          <div className="mt-5 grid-autofill">
            {posts.map((item, i) => (
              <PostGridBox wishlist={wishlist} userData={userData} post={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="text-center">you don't have any saved posts yet</div>
        )}
      </div>
    </div>
  );
}
