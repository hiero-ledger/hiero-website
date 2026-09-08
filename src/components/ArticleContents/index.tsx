"use client";

import { useEffect, useState } from "react";
import type { ArticleHeading } from "@/lib/headings";

/**
 * A post's contents, tracking where the reader is.
 *
 * Same device as the principles index on the home page, for the same reason:
 * the marker's length reports position without needing a scrollbar's worth of
 * chrome. The observer band is a thin strip across the middle of the viewport,
 * so the active entry is the section the reader is actually looking at rather
 * than whichever one happens to be topmost.
 *
 * Rendered only for posts with enough sections to be worth navigating — the
 * caller decides that, because most posts here are a few hundred words with a
 * single heading and a contents list of one entry is furniture, not help.
 */
export default function ArticleContents({
  headings,
}: {
  headings: ArticleHeading[];
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  // A primitive, so the effect re-runs when the post's headings change but not
  // on every render that hands it a fresh array of the same ids.
  const idsKey = headings.map(heading => heading.id).join("|");

  /**
   * The active entry is the last heading to have passed the reading line — a
   * third of the way down the viewport.
   *
   * Deliberately not an IntersectionObserver, which is what the principles
   * index on the home page uses. That works there because it observes the list
   * items, which are contiguous: one of them is always crossing the band. The
   * targets here are headings, which are thin and thousands of pixels apart, so
   * an observer band spends most of a long post empty and the marker sticks
   * wherever it last saw one. Asking "which heading is above the line" always
   * has an answer.
   */
  useEffect(() => {
    const ids = idsKey.split("|").filter(Boolean);

    if (!ids.length) return;

    const targets = ids
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!targets.length) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const line = window.innerHeight * 0.3;
      let current = targets[0];

      for (const target of targets) {
        if (target.getBoundingClientRect().top > line) break;
        current = target;
      }

      setActiveId(current.id);
    };

    // Coalesced onto a frame: the listener fires far more often than the
    // marker can move, and it reads layout.
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [idsKey]);

  return (
    <nav className="blog-contents" aria-label="On this page">
      <p className="blog-rail-label">On this page</p>

      <ol className="blog-contents-list">
        {headings.map(heading => (
          <li key={heading.id} data-level={heading.level}>
            <a
              href={`#${heading.id}`}
              className="blog-contents-link"
              aria-current={heading.id === activeId ? "true" : undefined}>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
