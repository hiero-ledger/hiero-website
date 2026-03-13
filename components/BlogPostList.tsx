"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import type { PostMeta } from "@/lib/posts";

const POSTS_PER_PAGE = 3;
const PAGER_SIZE = 5;

export default function BlogPostList({ posts, listTitle }: { posts: PostMeta[]; listTitle: string }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const pagePosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  // Hugo v0.133+ windowed pagination: show at most PAGER_SIZE page numbers
  const half = Math.floor(PAGER_SIZE / 2);
  const rawStart = Math.max(1, page - half);
  const windowEnd = Math.min(totalPages, rawStart + PAGER_SIZE - 1);
  const windowStart = Math.max(1, windowEnd - PAGER_SIZE + 1);
  const visiblePages = Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i);

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
              {pagePosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="grid grid-cols-[1fr] gap-0 sm:grid-cols-[280px_1fr] sm:gap-x-8 no-underline"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.featuredImage} alt={post.title} className="w-full h-[140px] object-cover" loading="lazy" />
                  <div>
                    <h3 className="mt-3 sm:mt-0 text-[20px] font-medium text-black">{post.title}</h3>
                    <p className="text-charcoal text-sm font-normal mt-1 leading-none">
                      {post.duration}{post.duration && <span className="mx-1">•</span>}
                      {format(new Date(post.date), "MMMM d, yyyy")}
                    </p>
                    {post.abstract && (
                      <p className="text-charcoal text-sm sm:text-base font-normal line-clamp-2 sm:line-clamp-4 mt-2">
                        {post.abstract.length > 400 ? post.abstract.slice(0, 400) + "…" : post.abstract}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <ul className="pagination pagination-default">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <a
                    aria-disabled={page === 1 ? "true" : undefined}
                    aria-label="First"
                    className="page-link"
                    role="button"
                    tabIndex={page === 1 ? -1 : 0}
                    onClick={(e) => { e.preventDefault(); if (page !== 1) goTo(1); }}
                  >
                    <span aria-hidden="true">&laquo;&laquo;</span>
                  </a>
                </li>
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <a
                    aria-disabled={page === 1 ? "true" : undefined}
                    aria-label="Previous"
                    className="page-link"
                    role="button"
                    tabIndex={page === 1 ? -1 : 0}
                    onClick={(e) => { e.preventDefault(); if (page > 1) goTo(page - 1); }}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                {visiblePages.map((p) => (
                  <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <a
                      aria-current={p === page ? "page" : undefined}
                      aria-label={`Page ${p}`}
                      className="page-link"
                      role="button"
                      onClick={(e) => { e.preventDefault(); goTo(p); }}
                    >
                      {p}
                    </a>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <a
                    aria-disabled={page === totalPages ? "true" : undefined}
                    aria-label="Next"
                    className="page-link"
                    role="button"
                    tabIndex={page === totalPages ? -1 : 0}
                    onClick={(e) => { e.preventDefault(); if (page < totalPages) goTo(page + 1); }}
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <a
                    aria-disabled={page === totalPages ? "true" : undefined}
                    aria-label="Last"
                    className="page-link"
                    role="button"
                    tabIndex={page === totalPages ? -1 : 0}
                    onClick={(e) => { e.preventDefault(); if (page < totalPages) goTo(totalPages); }}
                  >
                    <span aria-hidden="true">&raquo;&raquo;</span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
