"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import "swiper/css";

const quotesData = [
  {
    quote:
      '\u201cHedera\'s participation in Linux Foundation\'s Decentralized Trust will undoubtedly accelerate development, enhance security, and foster unprecedented collaboration within the Hedera ecosystem, positioning it at the forefront of blockchain innovation. As the leading wallet on the network, HashPack is committed to playing an active role in this new open source structure, and we look forward to <a href="https://www.hashpack.app/post/hashpack-on-hedera" target="_blank" rel="noreferrer noopener">contributing our expertise</a> to help shape the future of Hedera and the broader decentralized technology landscape.\u201d',
    author:
      'May Chan, CEO, <a href="https://www.hashpack.app/" target="_blank" rel="noreferrer noopener">HashPack</a>',
    logo: "/images/Hiero-Logo-HashPack.png",
  },
  {
    quote:
      '\u201cBy contributing its codebase to the Linux Foundation\'s Decentralized Trust, Hedera is demonstrating the ultimate commitment to open development. As a leading <a href="https://www.hgraph.com/blog/hedera-mirror-node" target="_blank" rel="noreferrer noopener">data infrastructure provider</a> in the ecosystem, Hgraph is actively dedicated to supporting the Hiero project as it transforms the open source DLT space and empowers the Hedera developer community.\u201d',
    author:
      'Tyler McDonald, CEO, <a href="https://hgraph.com/" target="_blank" rel="noreferrer noopener">Hgraph</a>',
    logo: "/images/Hiero-Logo-Hgraph.png",
  },
  {
    quote:
      "\u201cThe HBAR Foundry community is excited to see the contribution of the Hedera software to the Linux Foundation Decentralized Trust project. We're delighted to see Hedera's commitment to growing an independently governed and transparent community with more resources and opportunities to engage and grow the ecosystem.\u201d",
    author:
      '<a href="https://hbarfoundry.com/" target="_blank" rel="noreferrer noopener">The HBAR Foundry</a>, A Community Of Expert Hedera Builders',
    logo: "/images/Hiero-Logo-HbarFoundry.png",
  },
  {
    quote:
      "\u201cHedera's contribution of its codebase to the Linux Foundation's Decentralized Trust initiative is great news for SentX.io. By open-sourcing the Hashgraph technology, Hedera is reinforcing its commitment to innovation and decentralization. We expect this move to boost developer engagement, speed up the adoption of decentralized applications, and attract more retail users, driving growth across the ecosystem.\u201d",
    author:
      'Sam Jimenez &amp; Patr\u00edcia Carapinha, Founders, <a href="http://sentx.io/" target="_blank" rel="noreferrer noopener">SentX.io</a>',
    logo: "/images/Hiero-Logo-Sentx.png",
  },
  {
    quote:
      "\u201cTransferring ownership of Hedera's codebase to the Linux Foundation Decentralized Trust project is a testament to the power of open collaboration and meritocracy. This landmark initiative will empower developers, entrepreneurs, and enterprises to actively participate in shaping the future of Hedera. We are thrilled to be part of this vibrant ecosystem and look forward to contributing to its growth and success.\u201d",
    author:
      'Ivan Saiz, CTO, <a href="https://io.builders/" target="_blank" rel="noreferrer noopener">ioBuilders</a>',
    logo: "/images/Hiero-Logo-ioBuilders.png",
  },
  {
    quote:
      "\u201cHedera's contribution of its codebase to the Linux Foundation's Decentralized Trust entirely reshapes decentralized governance. At Calaxy, we view this as more than an infrastructure change - it's a move that drives real-world innovation. Developers now have greater autonomy and access to tools to build more inclusive, user-driven applications. We're excited to see how this enables devs to push the boundaries of creator-focused economies and further integrate blockchain into our everyday social experiences and relationships.\u201d",
    author:
      'Solo Ceesay, CEO &amp; Co-founder, <a href="https://calaxy.com/" target="_blank" rel="noreferrer noopener">Calaxy</a>',
    logo: "/images/Hiero-Logo-Calaxy.png",
  },
  {
    quote:
      "\u201cHedera's decision to open-source its codebase under the Linux Foundation Decentralized Trust is a monumental leap forward for the entire blockchain industry. This bold move not only underscores Hedera's commitment to decentralization and transparency but also paves the way for unprecedented community-driven innovation. We are excited to collaborate with the growing ecosystem to build a future where the possibilities are limitless.\u201d",
    author:
      'Rajiv Sohal, CTO, <a href="https://www.diamondstandard.co/" target="_blank" rel="noreferrer noopener">Diamond Standard</a>',
    logo: "/images/Hiero-Logo-DiamondStandard.svg",
  },
  {
    quote:
      "\u201cThis contribution represents a historic moment in the evolution of decentralized networks and is setting a precedent for transparency and collaboration in the blockchain industry. By contributing our codebase to LF Decentralized Trust, as project Hiero, we are reaffirming our commitment to open governance and collaboration. LF Decentralized Trust's mission to advance decentralized systems aligns perfectly with our own goals. We look forward to providing developers with unmatched access to tools and resources, creating an environment where decentralized applications can truly thrive.\u201d",
    author:
      'Charles Adkins, President, <a href="https://hedera.com/" target="_blank" rel="noreferrer noopener">Hedera</a>',
    logo: "/images/Hiero-Logo-Hedera.png",
  },
  {
    quote:
      "\u201cBy contributing Hiero to the Linux Foundation, an organization with a long history of supporting open source and open innovation, Hedera demonstrates to Council Members, ecosystem partners, grantees, and the builder community that it is committed to growing the capabilities of its network through transparency and meritocracy.\u201d",
    author:
      'Dr. Leemon Baird, Inventor, Co-founder, &amp; Chief Scientist, <a href="https://hashgraph.com/" target="_blank" rel="noreferrer noopener">Hashgraph</a>',
    logo: "/images/Hiero-Logo-Hashgraph.png",
  },
];

export default function QuotesCarousel() {
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

