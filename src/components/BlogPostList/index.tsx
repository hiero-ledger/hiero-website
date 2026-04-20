"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { PostMeta } from "@/lib/posts";

const POSTS_PER_PAGE = 3;
const PAGER_SIZE = 5;

interface BlogPostListProps {
  posts: PostMeta[];
  listTitle: string;
}

export default function BlogPostList({ posts, listTitle }: BlogPostListProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
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

  function goTo(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div id="posts" className="anchor">
      <div className="bg-white">
        <div className="container py-14 sm:py-[80px]">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-2xl mb-6 text-charcoal">{listTitle}</h2>

            <div className="flex flex-col gap-[40px] sm:gap-y-12">
              {pagePosts.map((post: PostMeta) => {
                const abstract = post.abstract ?? "";

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="grid grid-cols-[1fr] gap-0 sm:grid-cols-[280px_1fr] sm:gap-x-8 no-underline">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      width={560}
                      height={280}
                      sizes="(min-width: 640px) 280px, 100vw"
                      className="w-full md:h-[140px] object-cover"
                      unoptimized
                    />
                    <div>
                      <h3 className="mt-3 sm:mt-0 text-[20px] font-medium text-black">
                        {post.title}
                      </h3>
                      <p className="text-charcoal text-sm font-normal mt-1 leading-none">
                        {post.duration}
                        {post.duration && <span className="mx-1">•</span>}
                        {format(new Date(post.date), "MMMM d, yyyy")}
                      </p>
                      {abstract && (
                        <p className="text-charcoal text-sm sm:text-base font-normal line-clamp-2 sm:line-clamp-4 mt-2">
                          {abstract.length > 400
                            ? abstract.slice(0, 400) + "…"
                            : abstract}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <ul className="pagination pagination-default">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    type="button"
                    disabled={page === 1}
                    aria-label="First"
                    className="page-link"
                    onClick={() => {
                      if (page !== 1) goTo(1);
                    }}>
                    <span aria-hidden="true">&laquo;&laquo;</span>
                  </button>
                </li>
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    type="button"
                    disabled={page === 1}
                    aria-label="Previous"
                    className="page-link"
                    onClick={() => {
                      if (page > 1) goTo(page - 1);
                    }}>
                    <span aria-hidden="true">&laquo;</span>
                  </button>
                </li>
                {visiblePages.map(p => (
                  <li
                    key={p}
                    className={`page-item ${p === page ? "active" : ""}`}>
                    <button
                      type="button"
                      disabled={p === page}
                      aria-current={p === page ? "page" : undefined}
                      aria-label={`Page ${p}`}
                      className="page-link"
                      onClick={() => {
                        goTo(p);
                      }}>
                      {p}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button
                    type="button"
                    disabled={page === totalPages}
                    aria-label="Next"
                    className="page-link"
                    onClick={() => {
                      if (page < totalPages) goTo(page + 1);
                    }}>
                    <span aria-hidden="true">&raquo;</span>
                  </button>
                </li>
                <li
                  className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button
                    type="button"
                    disabled={page === totalPages}
                    aria-label="Last"
                    className="page-link"
                    onClick={() => {
                      if (page < totalPages) goTo(totalPages);
                    }}>
                    <span aria-hidden="true">&raquo;&raquo;</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
