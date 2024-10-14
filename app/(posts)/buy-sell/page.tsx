import {getPosts} from "@/actions/posts";
import PostsPage from "@/components/PostsPage";

export default async function page({searchParams}: {searchParams: {[key: string]: string}}) {
  const posts = await getPosts(["Buying", "Selling"]);

  if (!posts?.length) {
    return <div>no posts yet</div>;
  }
  return <PostsPage posts={posts} type="Buying" />;
}
