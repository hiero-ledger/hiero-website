"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { quotesData } from "@/data/homepage";

export default function QuotesCarousel() {
  return (
    <div id="quotes" className="anchor">
      <div className="pt-[40px] pb-[40px] sm:pt-[120px] sm:pb-[60px]">
        <div className="container container-mobile-full">
          <div className="relative w-full">
            {/* Left quote icon */}
            <div className="mx-auto mb-10 lg:mb-0 lg:absolute lg:top-[50%] lg:left-0 lg:-translate-x-[91px] lg:-translate-y-[50%] text-white-dark text-5xl h-[40px] w-[51px]">
              <Image
                src="/images/Hiero-Icon-Quote-Left.svg"
                alt=""
                width={51}
                height={40}
                loading="lazy"
              />
            </div>
            <div className="px-[25px] pt-[80px] lg:pt-[60px] lg:px-[60px] lg:pb-0 text-lg text-white bg-linear-to-br from-red-dark via-red to-red">
              <Swiper
                modules={[Navigation, Autoplay]}
                loop={true}
                autoplay={{ delay: 30000 }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                className="mySwiper"
              >
                {quotesData.map((quote, i) => (
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
                <div className="swiper-button swiper-button-next" />
                <div className="swiper-button swiper-button-prev" />
              </Swiper>
            </div>
            {/* Right quote icon */}
            <div className="mx-auto mt-10 lg:mt-0 lg:absolute lg:top-[50%] lg:left-auto lg:right-0 lg:translate-x-[91px] lg:-translate-y-[50%] text-white-dark text-5xl h-[40px] w-[51px]">
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
