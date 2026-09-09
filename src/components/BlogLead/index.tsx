import Image from "next/image";
import Link from "next/link";
import { formatPostDate } from "@/lib/dates";
import type { PostMeta } from "@/lib/posts";

/**
 * The newest post, given the whole width.
 *
 * Every post carries a featured image, and this is the one place on the blog
 * where showing one at size earns its keep: it gives the index a focal point
 * that a uniform list cannot, and it means the newest post is never something
 * the reader has to go looking for. It is also why the band it sits in is the
 * only one on the page without a gossip field behind it — the photograph is
 * the thing to look at there.
 */
export default function BlogLead({ post }: { post: PostMeta }) {
  const byline = post.authors
    .map(author => author.name)
    .filter(Boolean)
    .join(", ");

  return (
    <section className="blog-lead" aria-labelledby="blog-lead-title">
      <div className="container blog-lead-inner">
        <Link
          href={`/blog/${post.slug}`}
          aria-label={post.title}
          className="blog-lead-link">
          <span className="blog-lead-plate">
            <Image
              src={post.featuredImage}
              alt=""
              width={1200}
              height={675}
              sizes="(min-width: 1024px) 46rem, 100vw"
              className="blog-lead-image"
              priority
            />
          </span>

          <span className="blog-lead-body">
            <span className="blog-lead-eyebrow">Latest post</span>

            <h2 id="blog-lead-title" className="blog-lead-title">
              {post.title}
            </h2>

            {post.abstract && (
              <span className="blog-lead-abstract">{post.abstract}</span>
            )}

            <span className="blog-lead-byline">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              {byline && (
                <span className="blog-lead-byline-author">{byline}</span>
              )}
            </span>

            <span className="blog-lead-action">
              <span>Read the post</span>
              <span className="blog-lead-action-glyph" aria-hidden="true">
                →
              </span>
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
