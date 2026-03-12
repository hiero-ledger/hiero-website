"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import repoStats from "@/data/repository_stats.json";

const reposData = {
  heading: "Jump to our Hiero Repositories",
  text: "Explore some of our most active and widely used Hiero repositories.\nThese projects form the core of the Hiero ecosystem.",
  repos: [
    {
      name: "hiero-consensus-node",
      description:
        "Crypto, token, consensus, file, and smart contract services for a Hiero based network",
      link: "https://github.com/hiero-ledger/hiero-consensus-node",
    },
    {
      name: "hiero-local-node",
      description: "Run your own local Hiero based network for development purposes",
      link: "https://github.com/hiero-ledger/hiero-local-node",
    },
    {
      name: "hiero-mirror-node",
      description: "Archives data from consensus nodes and serves it via an API",
      link: "https://github.com/hiero-ledger/hiero-mirror-node",
    },
    {
      name: "hiero-improvement-proposals",
      description: "Hiero Improvement Proposal repository for community-driven enhancements",
      link: "https://github.com/hiero-ledger/hiero-improvement-proposals",
    },
    {
      name: "hiero-sdk-js",
      description: "JavaScript/TypeScript SDK for interacting with a Hiero network",
      link: "https://github.com/hiero-ledger/hiero-sdk-js",
    },
    {
      name: "hiero-sdk-java",
      description: "Java SDK for Hiero distributed ledger technology",
      link: "https://github.com/hiero-ledger/hiero-sdk-java",
    },
    {
      name: "hiero-json-rpc-relay",
      description: "Implementation of Ethereum JSON-RPC APIs for Hedera",
      link: "https://github.com/hiero-ledger/hiero-json-rpc-relay",
    },
    {
      name: "hiero-sdk-go",
      description: "Go SDK for Hiero distributed ledger technology",
      link: "https://github.com/hiero-ledger/hiero-sdk-go",
    },
    {
      name: "hiero-sdk-rust",
      description: "The Hiero Rust SDK for building on Hiero networks",
      link: "https://github.com/hiero-ledger/hiero-sdk-rust",
    },
    {
      name: "hiero-mirror-node-explorer",
      description: "Hedera Mirror Node Explorer for the Hedera Hashgraph DLT",
      link: "https://github.com/hiero-ledger/hiero-mirror-node-explorer",
    },
    {
      name: "hiero-cli",
      description: "Hiero command line tools for developers",
      link: "https://github.com/hiero-ledger/hiero-cli",
    },
    {
      name: "solo",
      description: "An opinionated CLI tool to deploy and manage standalone test networks",
      link: "https://github.com/hiero-ledger/solo",
    },
    {
      name: "hiero-block-node",
      description: "New Block Node services for Hiero networks",
      link: "https://github.com/hiero-ledger/hiero-block-node",
    },
    {
      name: "hiero-sdk-tck",
      description:
        "Technology Compatibility Kit used to verify compliant implementations of a Hiero SDK",
      link: "https://github.com/hiero-ledger/hiero-sdk-tck",
    },
    {
      name: "hiero-sdk-cpp",
      description:
        "A C++ SDK for Hiero: A C++ toolkit for creating and interacting with on-ledger assets",
      link: "https://github.com/hiero-ledger/hiero-sdk-cpp",
    },
    {
      name: "governance",
      description: "Configuration repository for managing all Hiero GitHub repositories",
      link: "https://github.com/hiero-ledger/governance",
    },
    {
      name: "hiero-sdk-python",
      description:
        "A Python SDK for Hiero: A Python toolkit for interacting with on-ledger assets",
      link: "https://github.com/hiero-ledger/hiero-sdk-python",
    },
    {
      name: "hiero-sdk-swift",
      description:
        "A Swift SDK for Hiero: A Swift toolkit for creating and interacting with on-ledger assets",
      link: "https://github.com/hiero-ledger/hiero-sdk-swift",
    },
    {
      name: "sdk-collaboration-hub",
      description: "Collaboration hub for SDK-related discussions and coordination",
      link: "https://github.com/hiero-ledger/sdk-collaboration-hub",
    },
    {
      name: "tsc",
      description: "Technical Steering Committee activity, discussions and decisions repository",
      link: "https://github.com/hiero-ledger/tsc",
    },
  ],
};

type RepoStats = Record<string, { stars: number }>;

export default function ReposCarousel() {
  const swiperRef = useRef<SwiperRef>(null);
  const stats = repoStats as RepoStats;

  return (
    <div id="repos" className="anchor">
      <div className="bg-white">
        <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px]">
          <div className="mb-10 sm:mb-16">
            <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5">{reposData.heading}</h2>
            <div className="text-lg max-w-full md:max-w-[800px]">{reposData.text}</div>
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
              {reposData.repos.map((repo) => (
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

