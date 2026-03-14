import type { Metadata } from "next";
import BlogPostList from "@/components/BlogPostList";
import {
  getAllPosts,
  getBlogIndexMeta,
  type BlogIndexMeta,
  type PostMeta,
} from "../../lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stay up to date with our latest news and announcements.",
};

export default function BlogPage() {
  const posts: PostMeta[] = getAllPosts();
  const blogMeta: BlogIndexMeta = getBlogIndexMeta();

  return (
    <>
      <div
        id="hero"
        className="bg-gradient-to-br from-red-dark via-red to-red relative">
        <div className="container py-14 sm:py-[100px] xl:py-36 text-white text-center">
          <h1 className="text-[42px] sm:text-5xl leading-none relative mb-2.5">
            {blogMeta.title}
          </h1>
          <p className="text-[24px] tracking-[-0.081rem] sm:text-xl relative">
            {blogMeta.subtitle}
          </p>
        </div>
      </div>
      <BlogPostList posts={posts} listTitle={blogMeta.listTitle} />
    </>
  );
}
