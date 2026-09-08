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

  useEffect(() => {
    const ids = idsKey.split("|").filter(Boolean);

    if (!ids.length || !("IntersectionObserver" in window)) return;

    const targets = ids
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      observed => {
        const reached = observed
          .filter(entry => entry.isIntersecting)
          .map(entry => targets.indexOf(entry.target as HTMLElement))
          .filter(index => index >= 0);

        if (!reached.length) return;

        setActiveId(targets[Math.min(...reached)].id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    targets.forEach(target => observer.observe(target));

    return () => observer.disconnect();
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
