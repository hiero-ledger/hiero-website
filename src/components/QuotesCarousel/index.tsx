"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperRef } from "swiper/react";
import "swiper/css";
import RichText from "@/components/RichText";

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
  const swiperRef = useRef<SwiperRef>(null);

  return (
    <section
      id="quotes"
      aria-labelledby="quotes-heading"
      className="quotes-carousel anchor">
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
          <Swiper
            ref={swiperRef}
            loop={data.quotes.length > 1}
            autoHeight
            className="quotes-carousel-swiper">
            {data.quotes.map(quote => (
              <SwiperSlide key={quote.author}>
                <article
                  className="quotes-carousel-slide"
                  aria-roledescription="slide">
                  <div className="quotes-carousel-logo-wrap">
                    <Image
                      src={quote.logo}
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
                      markdown={quote.quote}
                      className="quotes-carousel-quote"
                    />
                    <footer className="quotes-carousel-author">
                      <RichText inline markdown={quote.author} />
                    </footer>
                  </blockquote>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {data.quotes.length > 1 ? (
            <div className="quotes-carousel-controls">
              <p>Community perspectives</p>

              <div className="quotes-carousel-buttons">
                <button
                  type="button"
                  onClick={() => swiperRef.current?.swiper.slidePrev()}
                  aria-label="Previous quote"
                  className="quotes-carousel-control">
                  <span aria-hidden="true">←</span>
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.swiper.slideNext()}
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
