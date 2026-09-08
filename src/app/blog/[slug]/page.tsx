import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import BlogPostCard from "@/components/BlogPostCard";
import Divider from "@/components/Divider";
import GossipField from "@/components/GossipField";
import RichText from "@/components/RichText";
import ShareButtons from "@/components/ShareButtons/ClientShareButtons";
import {
  getAllPosts,
  getPostBySlug,
  type PostAuthor,
  type PostFull,
  type PostMeta,
} from "../../../lib/posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiero.org";
const RELATED_COUNT = 3;

export function generateStaticParams(): { slug: string }[] {
  const posts: PostMeta[] = getAllPosts();
  return posts.map((post: PostMeta) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post: PostFull | null = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.abstract };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: PostFull | null = getPostBySlug(slug);
  if (!post) notFound();

  const shareUrl = `${BASE_URL}/blog/${post.slug}`;

  const relatedPosts: PostMeta[] = getAllPosts()
    .filter((candidate: PostMeta) => candidate.slug !== slug)
    .slice(0, RELATED_COUNT);

  return (
    <article className="blog-article-page">
      <div className="blog-article">
        <GossipField placement="article" />

        <div className="container blog-article-inner">
          <Link href="/blog/" className="blog-article-back">
            <span aria-hidden="true">←</span>
            <span>All posts</span>
          </Link>

          {/* The date and reading time sit here, once, rather than repeating
              beside every author the way they used to. */}
          <p className="blog-article-eyebrow">
            <time dateTime={post.date}>
              {format(new Date(post.date), "d MMMM yyyy")}
            </time>
            {post.duration && <span>{post.duration}</span>}
          </p>

          <h1 className="blog-article-title">{post.title}</h1>

          {post.abstract && (
            <p className="blog-article-standfirst">{post.abstract}</p>
          )}

          {post.authors.length > 0 && (
            <ul role="list" className="blog-article-authors">
              {post.authors.map((author: PostAuthor, i: number) => (
                <li key={author.link ?? author.name ?? i}>
                  <Author author={author} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* No featured image here, deliberately. Almost every post's image is a
          red title card with the post's own headline set into it, so running
          it under the `h1` prints the same sentence twice — once at 4rem and
          again inside a picture. The index shows it where it is the only thing
          identifying the post; here the headline already is. */}
      <div className="blog-article-body">
        <div className="container">
          <div className="blog-article-prose">
            <RichText markdown={post.contentMarkdown} className="content" />

            <footer className="blog-article-share">
              <p className="blog-article-share-label">Share this post</p>
              <ShareButtons shareUrl={shareUrl} shareTitle={post.title} />
            </footer>
          </div>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <>
          <Divider />

          <section
            className="blog-article-more"
            aria-labelledby="blog-article-more-heading">
            <div className="container blog-article-more-inner">
              <header className="blog-article-more-header">
                <h2
                  id="blog-article-more-heading"
                  className="blog-article-more-heading">
                  Recent posts
                </h2>
                <Link href="/blog/" className="blog-article-more-link">
                  <span>All posts</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </header>

              {/* Three, which is exactly one row of the archive's grid. */}
              <ul role="list" className="blog-grid">
                {relatedPosts.map((related: PostMeta) => (
                  <li key={related.slug} className="blog-grid-item">
                    <BlogPostCard post={related} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </article>
  );
}

function Author({ author }: { author: PostAuthor }) {
  const affiliation = [author.title, author.organization]
    .filter(Boolean)
    .join(", ");

  const inner = (
    <>
      {author.image && (
        <Image
          src={author.image}
          alt=""
          width={80}
          height={80}
          className="blog-article-author-avatar"
        />
      )}
      <span className="blog-article-author-text">
        <span className="blog-article-author-name">{author.name}</span>
        {affiliation && (
          <span className="blog-article-author-affiliation">{affiliation}</span>
        )}
      </span>
    </>
  );

  if (author.link) {
    return (
      <a
        href={author.link}
        target="_blank"
        rel="noopener noreferrer"
        className="blog-article-author blog-article-author--link">
        {inner}
      </a>
    );
  }

  return <span className="blog-article-author">{inner}</span>;
}
