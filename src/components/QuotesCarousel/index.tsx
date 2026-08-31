"use client";

import { useState } from "react";
import Image from "next/image";
import RichText from "@/components/RichText";
import GossipField from "@/components/GossipField";

interface QuoteItem {
  quote: string;
  author: string;
  logo: string;
}

interface QuotesData {
  eyebrow: string;
  heading: string;
  text: string;
  quotes: QuoteItem[];
}

interface QuotesCarouselProps {
  data: QuotesData;
}

export default function QuotesCarousel({ data }: QuotesCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "previous">("next");
  const activeQuote = data.quotes[activeIndex];

  const showPrevious = () => {
    setDirection("previous");
    setActiveIndex(index => (index === 0 ? data.quotes.length - 1 : index - 1));
  };

  const showNext = () => {
    setDirection("next");
    setActiveIndex(index => (index + 1) % data.quotes.length);
  };

  return (
    <section
      id="quotes"
      aria-labelledby="quotes-heading"
      className="quotes-carousel">
      <GossipField placement="quotes" />

      <div className="container quotes-carousel-inner">
        <header className="quotes-carousel-header">
          <div>
            <p className="quotes-carousel-eyebrow">{data.eyebrow}</p>
            <h2 id="quotes-heading" className="quotes-carousel-heading">
              {data.heading}
            </h2>
          </div>
          <p className="quotes-carousel-copy">{data.text}</p>
        </header>

        <div
          className="quotes-carousel-stage"
          role="region"
          aria-roledescription="carousel"
          aria-label="Community testimonials">
          <div
            className="quotes-carousel-viewport"
            aria-live="polite"
            aria-atomic="true">
            <article
              key={activeQuote.author}
              className="quotes-carousel-slide"
              data-direction={direction}
              aria-roledescription="slide">
              <div className="quotes-carousel-logo-wrap">
                <span className="quotes-carousel-logo-label">
                  Ecosystem voice
                </span>
                <Image
                  src={activeQuote.logo}
                  alt=""
                  width={180}
                  height={52}
                  className="quotes-carousel-logo"
                  loading="lazy"
                />
              </div>

              <blockquote className="quotes-carousel-testimonial">
                <Image
                  src="/images/Hiero-Icon-Quote-Left.svg"
                  alt=""
                  width={51}
                  height={40}
                  className="quotes-carousel-mark"
                  loading="lazy"
                />
                <RichText
                  inline
                  markdown={activeQuote.quote}
                  className="quotes-carousel-quote"
                />
                <footer className="quotes-carousel-author">
                  <RichText inline markdown={activeQuote.author} />
                </footer>
              </blockquote>
            </article>
          </div>

          {data.quotes.length > 1 ? (
            <div className="quotes-carousel-controls">
              <div className="quotes-carousel-status">
                <p>Community perspectives</p>
                <div
                  className="quotes-carousel-progress"
                  aria-label={`Quote ${activeIndex + 1} of ${data.quotes.length}`}>
                  {data.quotes.map((quote, index) => (
                    <span
                      key={quote.author}
                      data-active={index === activeIndex ? "true" : undefined}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              <div className="quotes-carousel-buttons">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous quote"
                  className="quotes-carousel-control">
                  <span aria-hidden="true">←</span>
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next quote"
                  className="quotes-carousel-control">
                  <span>Next</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
