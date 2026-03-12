import Image from "next/image";

type WhatIsHieroPoint = {
  heading: string;
  text: string;
  icon: string;
};

type WhatIsHieroData = {
  heading: string;
  text: string;
  points: WhatIsHieroPoint[];
};

type WhatIsHieroSectionProps = {
  data: WhatIsHieroData;
};

export default function WhatIsHieroSection({ data }: WhatIsHieroSectionProps) {
  return (
    <div id="what-is-hiero" className="anchor">
      <div className="bg-white">
        <div
          id="what-is-hiero-content"
          className="container pt-[80px] pb-[40px] sm:pt-[120px] sm:pb-[120px] grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-[60px] lg:gap-32"
        >
          <div id="what-is-hiero-intro-column">
            <div id="what-is-hiero-intro">
              <h2 className="text-3xl mb-2.5 sm:text-4xl sm:mb-0">
                {data.heading}
              </h2>
              <p
                className="text-base sm:text-lg max-w-[390px]"
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-[60px] sm:gap-10">
            {data.points.map((point, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr] sm:grid-cols-[55px_1fr] gap-5 sm:gap-10"
              >
                <Image
                  src={point.icon}
                  alt=""
                  width={55}
                  height={55}
                  loading="lazy"
                />
                <div>
                  <h3
                    className="text-2xl mb-5 sm:mb-2 [&>strong]:text-red"
                    dangerouslySetInnerHTML={{ __html: point.heading }}
                  />
                  <p className="text-base">{point.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

