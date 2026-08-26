"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import RichText from "@/components/RichText";

interface WhatIsHieroPoint {
  /** Markdown; the property itself is the emphasised half of the phrase. */
  heading: string;
  text: string;
  icon: string;
}

interface WhatIsHieroData {
  eyebrow: string;
  heading: string;
  text: string;
  points: WhatIsHieroPoint[];
}

interface WhatIsHieroSectionProps {
  data: WhatIsHieroData;
}

const HEADING_ID = "what-is-hiero-heading";

/**
 * The property is whatever the copy emphasises — the same half of the phrase
 * the type treatment enlarges — so the index, the anchors and the heading can
 * never disagree about which word this entry is about.
 */
const EMPHASISED = /\*\*(.+?)\*\*/;

function propertyOf(heading: string) {
  return EMPHASISED.exec(heading)?.[1] ?? heading;
}

function anchorFor(property: string) {
  return `hiero-is-${property.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export default function WhatIsHieroSection({ data }: WhatIsHieroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const thesisRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const entries = data.points.map(point => {
    const property = propertyOf(point.heading);

    return { ...point, property, anchor: anchorFor(property) };
  });

  // Which entry the reader is on. Not motion — it is the state the index
  // reports — so it runs whatever the reader's motion preference is, and only
  // the marker's travel is a transition that `motion-reduce` can drop.
  useEffect(() => {
    const items = itemsRef.current.filter(Boolean) as HTMLLIElement[];

    if (!items.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      observed => {
        // The root is a thin band across the middle of the viewport, so the
        // entry that intersects it is the one the reader is looking at.
        const reached = observed
          .filter(entry => entry.isIntersecting)
          .map(entry => items.indexOf(entry.target as HTMLLIElement))
          .filter(index => index >= 0);

        if (!reached.length) return;

        setActiveIndex(Math.min(...reached));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  // Each entry arrives as it is reached rather than the whole list arriving at
  // once, which is what the old single section-level observer did: by the time
  // you scrolled to the sixth entry it had already played, off screen.
  useEffect(() => {
    const section = sectionRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!section || reduceMotion || !("IntersectionObserver" in window)) {
      return;
    }

    section.dataset.motion = "ready";

    const observer = new IntersectionObserver(
      observed => {
        observed.forEach(entry => {
          if (!entry.isIntersecting) return;

          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    [thesisRef.current, ...itemsRef.current]
      .filter(Boolean)
      .forEach(element => observer.observe(element as Element));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-is-hiero"
      aria-labelledby={HEADING_ID}
      className="hiero-principles">
      <div className="container hiero-principles-inner">
        <div ref={thesisRef} className="hiero-principles-thesis">
          <p className="hiero-principles-eyebrow">{data.eyebrow}</p>
          <h2 id={HEADING_ID} className="hiero-principles-heading">
            {data.heading}
          </h2>
          <RichText
            as="div"
            className="hiero-principles-intro"
            markdown={data.text}
          />

          <nav className="hiero-principles-index" aria-label={data.heading}>
            <ul className="hiero-principles-index-list">
              {entries.map((entry, index) => (
                <li key={entry.anchor}>
                  <a
                    href={`#${entry.anchor}`}
                    className="hiero-principles-index-link"
                    aria-current={index === activeIndex ? "true" : undefined}>
                    {entry.property}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <ul className="hiero-principles-list">
          {entries.map((entry, index) => (
            <li
              key={entry.anchor}
              id={entry.anchor}
              ref={item => {
                itemsRef.current[index] = item;
              }}
              data-active={index === activeIndex ? "true" : undefined}
              className="hiero-principles-item">
              <Image
                src={entry.icon}
                alt=""
                width={56}
                height={57}
                className="hiero-principles-icon"
                loading="lazy"
              />
              <div className="hiero-principles-body">
                <RichText
                  as="h3"
                  inline
                  markdown={entry.heading}
                  className="hiero-principles-term"
                />
                <p className="hiero-principles-detail">{entry.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
