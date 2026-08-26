"use client";

import { useEffect, useRef } from "react";
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

export default function WhatIsHieroSection({ data }: WhatIsHieroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // The reveal is opt-in from script: `data-motion` is what arms the hidden
  // starting state, so with JS off, a stalled hydration, or reduced motion
  // preferred, the list is simply there.
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
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;

        section.dataset.visible = "true";
        observer.disconnect();
      },
      { threshold: 0.18 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-is-hiero"
      className="hiero-principles"
      aria-labelledby={HEADING_ID}>
      <div className="container hiero-principles-inner">
        <div className="hiero-principles-thesis">
          <p className="hiero-principles-eyebrow">{data.eyebrow}</p>
          <h2 id={HEADING_ID} className="hiero-principles-heading">
            {data.heading}
          </h2>
          <RichText
            as="div"
            className="hiero-principles-intro"
            markdown={data.text}
          />
        </div>

        <ul className="hiero-principles-list">
          {data.points.map(point => (
            <li key={point.heading} className="hiero-principles-item">
              <Image
                src={point.icon}
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
                  markdown={point.heading}
                  className="hiero-principles-term"
                />
                <p className="hiero-principles-detail">{point.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
