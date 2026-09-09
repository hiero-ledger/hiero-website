import type { Metadata } from "next";
import BlogLead from "@/components/BlogLead";
import BlogPostList from "@/components/BlogPostList";
import Divider from "@/components/Divider";
import GossipField from "@/components/GossipField";
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

  /* `getAllPosts` sorts newest first, so the lead is the head of the list and
     the archive is everything behind it. */
  const [lead, ...archive] = posts;

  return (
    <>
      <section className="blog-index" aria-labelledby="blog-index-heading">
        <GossipField placement="blog" />

        <div className="container blog-index-inner">
          <header className="blog-index-header">
            <div>
              <p className="blog-index-eyebrow">Project news</p>
              <h1 id="blog-index-heading" className="blog-index-heading">
                {blogMeta.title}
              </h1>
            </div>

            <p className="blog-index-copy">{blogMeta.subtitle}</p>
          </header>
        </div>
      </section>

      {lead && <BlogLead post={lead} />}

      {archive.length > 0 && (
        <>
          <Divider />
          <BlogPostList posts={archive} listTitle={blogMeta.listTitle} />
        </>
      )}
    </>
  );
}
