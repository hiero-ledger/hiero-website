import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import ArticleContents from "@/components/ArticleContents";
import BlogPostCard from "@/components/BlogPostCard";
import Divider from "@/components/Divider";
import GossipField from "@/components/GossipField";
import RichText from "@/components/RichText";
import ShareButtons from "@/components/ShareButtons/ClientShareButtons";
import { extractHeadings, type ArticleHeading } from "@/lib/headings";
import {
  getAllPosts,
  getPostBySlug,
  type PostAuthor,
  type PostFull,
  type PostMeta,
} from "../../../lib/posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiero.org";

/** One row of the archive grid. */
const RELATED_COUNT = 3;

/**
 * Below this, a contents list is furniture rather than help. Most posts here
 * run a few hundred words under a single heading; the ones that earn a
 * contents list are the HIP explainers and the long community write-ups.
 */
const MIN_HEADINGS_FOR_CONTENTS = 3;

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
  const readingTime = post.duration ?? `${post.readingMinutes} min read`;

  const headings: ArticleHeading[] = extractHeadings(post.contentMarkdown);
  const contents =
    headings.length >= MIN_HEADINGS_FOR_CONTENTS ? headings : null;

  /* `getAllPosts` is newest first, so the entry before this one is the newer
     post. Most of this blog is a weekly series, which is what makes the
     neighbours worth naming: the next week's round-up is a more useful
     destination than another three cards. */
  const all: PostMeta[] = getAllPosts();
  const index = all.findIndex(candidate => candidate.slug === slug);
  const newer = index > 0 ? all[index - 1] : undefined;
  const older = index >= 0 ? all[index + 1] : undefined;

  /* Whatever the neighbour links already offer is kept out of the grid below,
     so the same post is not put in front of the reader twice. */
  const shown = new Set(
    [slug, newer?.slug, older?.slug].filter(Boolean) as string[],
  );
  const relatedPosts = all
    .filter(candidate => !shown.has(candidate.slug))
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

          {/* Date and reading time sit here, once, rather than repeating
              beside every author the way they used to. */}
          <p className="blog-article-eyebrow">
            <time dateTime={post.date}>
              {format(new Date(post.date), "d MMMM yyyy")}
            </time>
            <span>{readingTime}</span>
          </p>

          <h1 className="blog-article-title">{post.title}</h1>

          {post.abstract && (
            <p className="blog-article-standfirst">{post.abstract}</p>
          )}
        </div>
      </div>

      {/* The reading band. The prose keeps the container's left edge so the
          title above and the first line of the body share one axis, and the
          rail takes the space to its right that a single column left empty.
          Below `xl` the rail moves underneath. */}
      <div className="blog-article-body">
        <div className="container blog-article-layout">
          <div className="blog-article-prose">
            <RichText markdown={post.contentMarkdown} className="content" />
          </div>

          <aside className="blog-rail" aria-label="About this post">
            <div className="blog-rail-inner">
              {/* The post's own artwork, at the size it was drawn for rather
                  than as a banner under the headline it already contains. */}
              <span className="blog-rail-plate">
                <Image
                  src={post.featuredImage}
                  alt=""
                  width={720}
                  height={405}
                  sizes="22rem"
                  className="blog-rail-image"
                />
              </span>

              {post.authors.length > 0 && (
                <div className="blog-rail-block">
                  <p className="blog-rail-label">
                    {post.authors.length > 1 ? "Authors" : "Author"}
                  </p>
                  <ul role="list" className="blog-rail-authors">
                    {post.authors.map((author: PostAuthor, i: number) => (
                      <li key={author.link ?? author.name ?? i}>
                        <Author author={author} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {contents && <ArticleContents headings={contents} />}

              <div className="blog-rail-block">
                <p className="blog-rail-label">Share</p>
                <ShareButtons shareUrl={shareUrl} shareTitle={post.title} />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {(newer || older) && (
        <nav className="blog-series" aria-label="Nearby posts">
          <div className="container blog-series-inner">
            {older ? (
              <Neighbour post={older} direction="older" />
            ) : (
              <span aria-hidden="true" />
            )}
            {newer && <Neighbour post={newer} direction="newer" />}
          </div>
        </nav>
      )}

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
                  More from the blog
                </h2>
                <Link href="/blog/" className="blog-article-more-link">
                  <span>All posts</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </header>

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

/** The post either side of this one in date order. */
function Neighbour({
  post,
  direction,
}: {
  post: PostMeta;
  direction: "older" | "newer";
}) {
  const older = direction === "older";

  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={`${older ? "Older" : "Newer"} post: ${post.title}`}
      className={`blog-series-link ${
        older ? "blog-series-link--older" : "blog-series-link--newer"
      }`}>
      <span className="blog-series-direction">
        <span aria-hidden="true">{older ? "←" : "→"}</span>
        <span>{older ? "Older post" : "Newer post"}</span>
      </span>
      <span className="blog-series-title">{post.title}</span>
    </Link>
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
          className="blog-rail-avatar"
        />
      )}
      <span className="blog-rail-author-text">
        <span className="blog-rail-author-name">{author.name}</span>
        {affiliation && (
          <span className="blog-rail-author-affiliation">{affiliation}</span>
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
        className="blog-rail-author blog-rail-author--link">
        {inner}
      </a>
    );
  }

  return <span className="blog-rail-author">{inner}</span>;
}
