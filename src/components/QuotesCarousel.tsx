"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import "swiper/css";

type QuoteItem = {
  quote: string;
  author: string;
  logo: string;
};

type QuotesCarouselProps = {
  data: QuoteItem[];
};

export default function QuotesCarousel({ data }: QuotesCarouselProps) {
  const swiperRef = useRef<SwiperRef>(null);

  return (
    <div id="quotes" className="anchor">
      <div className="pt-[40px] pb-[40px] sm:pt-[120px] sm:pb-[60px]">
        <div className="container container-mobile-full">
          <div className="relative w-full">
            {/* Left quote icon */}
            <div className="mx-auto mb-10 lg:mb-0 lg:absolute lg:top-[50%] lg:left-0 lg:-translate-x-[91px] lg:-translate-y-[50%] h-[40px] w-[51px]">
              <Image
                src="/images/Hiero-Icon-Quote-Left.svg"
                alt=""
                width={51}
                height={40}
                loading="lazy"
              />
            </div>
            <div className="relative px-[25px] pt-[80px] lg:pt-[60px] lg:px-[60px] lg:pb-0 text-lg text-white bg-linear-to-br from-red-dark via-red to-red">
              <Swiper
                ref={swiperRef}
                modules={[Autoplay]}
                loop={true}
                autoplay={{ delay: 30000 }}
                className="mySwiper"
              >
                {data.map((quote, i) => (
                  <SwiperSlide key={i}>
                    <div className="mb-5 flex justify-center h-[38px]">
                      <Image
                        src={quote.logo}
                        alt=""
                        width={160}
                        height={38}
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div
                      className="mb-5 [&>a]:text-white"
                      dangerouslySetInnerHTML={{ __html: quote.quote }}
                    />
                    <div
                      className="font-bold mb-[155px] [&>a]:text-white"
                      dangerouslySetInnerHTML={{ __html: quote.author }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Custom nav buttons — absolute inside the red container, matching Hugo's bottom:5rem centered style */}
              <button
                onClick={() => swiperRef.current?.swiper.slidePrev()}
                aria-label="Previous quote"
                className="absolute bottom-20 left-[calc(50%-40px)] z-10 w-[35px] h-[35px] bg-white-dark text-charcoal flex items-center justify-center cursor-pointer hover:bg-sand transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => swiperRef.current?.swiper.slideNext()}
                aria-label="Next quote"
                className="absolute bottom-20 right-[calc(50%-40px)] z-10 w-[35px] h-[35px] bg-white-dark text-charcoal flex items-center justify-center cursor-pointer hover:bg-sand transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
            {/* Right quote icon */}
            <div className="mx-auto mt-10 lg:mt-0 lg:absolute lg:top-[50%] lg:left-auto lg:right-0 lg:translate-x-[91px] lg:-translate-y-[50%] h-[40px] w-[51px]">
              <Image
                src="/images/Hiero-Icon-Quote-Right.svg"
                alt=""
                width={51}
                height={40}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

