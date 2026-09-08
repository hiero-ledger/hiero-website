import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { PostMeta } from "@/lib/posts";

/**
 * One post as a card: featured image, date, title, abstract, action.
 *
 * Built on the same shape as the repository cards on the home page — hairline
 * border on the sand band, lifting on hover, a circular glyph that fills red —
 * so a grid of these reads as the same kind of object as the grid there. The
 * image is flush to the card's top edge rather than inset, which is why the
 * card clips its own overflow and the padding sits on the body below.
 *
 * `aria-label` on the link is deliberate. The card wraps image, date, title,
 * abstract and action in a single anchor, and without it the accessible name
 * is all of them run together; with it the link announces the title, and the
 * rest stays where it belongs — as context around the link.
 */
export default function BlogPostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-label={post.title}
      className="blog-card">
      <span className="blog-card-plate">
        <Image
          src={post.featuredImage}
          alt=""
          width={720}
          height={405}
          sizes="(min-width: 1280px) 24rem, (min-width: 768px) 45vw, 100vw"
          className="blog-card-image"
        />
      </span>

      <span className="blog-card-body">
        <time className="blog-card-date" dateTime={post.date}>
          {format(new Date(post.date), "dd MMM yyyy")}
        </time>

        {/* A heading rather than a span: it keeps the archive navigable by
            heading, and the link's own name stays the `aria-label` above. */}
        <h3 className="blog-card-title">{post.title}</h3>

        {post.abstract && (
          <span className="blog-card-abstract">{post.abstract}</span>
        )}

        <span className="blog-card-action" aria-hidden="true">
          <span>Read the post</span>
          <span className="blog-card-action-glyph">→</span>
        </span>
      </span>
    </Link>
  );
}
