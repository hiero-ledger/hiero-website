"use client";

import { useRef, useState } from "react";
import BlogPostCard from "@/components/BlogPostCard";
import GossipField from "@/components/GossipField";
import type { PostMeta } from "@/lib/posts";

/**
 * Nine, filling three rows of three at the widest breakpoint — the same count
 * and the same grid the repository section on the home page uses, so the two
 * collections read as the same kind of thing. Three per page was the old
 * count, and it put this archive at twenty-four pages.
 */
const POSTS_PER_PAGE = 9;
const PAGER_SIZE = 5;

interface BlogPostListProps {
  posts: PostMeta[];
  listTitle: string;
}

export default function BlogPostList({ posts, listTitle }: BlogPostListProps) {
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const pagePosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE,
  );

  const half = Math.floor(PAGER_SIZE / 2);
  const rawStart = Math.max(1, page - half);
  const windowEnd = Math.min(totalPages, rawStart + PAGER_SIZE - 1);
  const windowStart = Math.max(1, windowEnd - PAGER_SIZE + 1);
  const visiblePages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, i) => windowStart + i,
  );

  /**
   * Back to the top of the archive, not the top of the document: the reader
   * asked for the next page of posts, so the first row of it is what they want
   * in view. `scroll-mt` on the section keeps it clear of the fixed header, and
   * `scroll-behavior` in the base layer already yields to a motion preference.
   */
  function goTo(next: number) {
    setPage(next);
    topRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <section
      id="posts"
      ref={topRef}
      className="blog-archive"
      aria-labelledby="blog-archive-heading">
      <GossipField placement="archive" />

      <div className="container blog-archive-inner">
        <header className="blog-archive-header">
          <h2 id="blog-archive-heading" className="blog-archive-heading">
            {listTitle}
          </h2>
          <p className="blog-archive-tally">
            <span>{posts.length} posts</span>
            {totalPages > 1 && (
              <span>
                Page {page} of {totalPages}
              </span>
            )}
          </p>
        </header>

        <ul role="list" className="blog-grid">
          {pagePosts.map(post => (
            <li key={post.slug} className="blog-grid-item">
              <BlogPostCard post={post} />
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <nav className="blog-pagination" aria-label="Archive pages">
            <ul role="list" className="blog-pagination-list">
              <PagerStep
                label="First"
                glyph="«"
                disabled={page === 1}
                onSelect={() => goTo(1)}
              />
              <PagerStep
                label="Previous"
                glyph="←"
                disabled={page === 1}
                onSelect={() => goTo(page - 1)}
              />

              {visiblePages.map(p => (
                <li key={p} className="blog-pagination-item">
                  <button
                    type="button"
                    disabled={p === page}
                    aria-current={p === page ? "page" : undefined}
                    aria-label={`Page ${p}`}
                    className="blog-pagination-link"
                    onClick={() => goTo(p)}>
                    {p}
                  </button>
                </li>
              ))}

              <PagerStep
                label="Next"
                glyph="→"
                disabled={page === totalPages}
                onSelect={() => goTo(page + 1)}
              />
              <PagerStep
                label="Last"
                glyph="»"
                disabled={page === totalPages}
                onSelect={() => goTo(totalPages)}
              />
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}

function PagerStep({
  label,
  glyph,
  disabled,
  onSelect,
}: {
  label: string;
  glyph: string;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="blog-pagination-item">
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        className="blog-pagination-link blog-pagination-link--step"
        onClick={() => {
          if (!disabled) onSelect();
        }}>
        <span aria-hidden="true">{glyph}</span>
      </button>
    </li>
  );
}
