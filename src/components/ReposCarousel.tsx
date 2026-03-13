"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import repoStats from "@/data/repository_stats.json";

type RepoItem = {
  name: string;
  description: string;
  link: string;
};

type ReposData = {
  heading: string;
  text: string;
  repos: RepoItem[];
};

type ReposCarouselProps = {
  data: ReposData;
};

type RepoStats = Record<string, { stars: number }>;

export default function ReposCarousel({ data }: ReposCarouselProps) {
  const swiperRef = useRef<SwiperRef>(null);
  const stats = repoStats as RepoStats;

  return (
    <div id="repos" className="anchor">
      <div className="bg-white">
        <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px]">
          <div className="mb-10 sm:mb-16">
            <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5">{data.heading}</h2>
            <div className="text-lg max-w-full md:max-w-[800px]">{data.text}</div>
          </div>
          <div className="relative w-full px-16">
            <Swiper
              ref={swiperRef}
              modules={[Pagination]}
              loop={true}
              slidesPerView={1}
              spaceBetween={24}
              grabCursor={true}
              pagination={{ el: ".repos-pagination", clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 32 },
              }}
              className="reposSwiper"
            >
              {data.repos.map((repo) => (
                <SwiperSlide key={repo.name} style={{ height: "auto" }}>
                  <div className="border-2 border-white-dark rounded-2xl p-8 hover:border-red transition-colors duration-200 bg-white h-full flex flex-col">
                    <h3 className="text-xl sm:text-2xl font-medium mb-3 text-red">
                      {repo.name}
                    </h3>
                    <p className="text-base mb-4 text-gray-600 flex-grow">
                      {repo.description}
                    </p>
                    <div className="flex flex-row justify-between items-center mt-4">
                      <a
                        href={repo.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-red hover:text-red-dark text-base font-medium underline"
                      >
                        View Repository →
                      </a>
                      <span className="text-sm text-gray-600">
                        ⭐ {stats[repo.name]?.stars ?? 0}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div className="repos-pagination swiper-pagination !relative !bottom-0 mt-8" />
            </Swiper>
            <button
              onClick={() => swiperRef.current?.swiper.slidePrev()}
              className="repos-nav-prev absolute top-1/2 left-0 transform -translate-y-1/2 z-10 w-12 h-12 bg-red rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-dark transition-all duration-200 cursor-pointer"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => swiperRef.current?.swiper.slideNext()}
              className="repos-nav-next absolute top-1/2 right-0 transform -translate-y-1/2 z-10 w-12 h-12 bg-red rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-dark transition-all duration-200 cursor-pointer"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

