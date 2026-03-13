import Image from "next/image";

type OpenSourceData = {
  whyHeading: string;
  whyText: string;
  whatHeading: string;
  whatText: string;
};

type OpenSourceSectionProps = {
  data: OpenSourceData;
};

export default function OpenSourceSection({ data }: OpenSourceSectionProps) {
  return (
    <div className="bg-white">
      <div className="container pt-[40px] pb-[40px] sm:pt-[92px] sm:pb-[154px] grid grid-cols-1 sm:grid-cols-2 gap-[80px] sm:gap-10 relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Hiero-Logo-Outline.svg"
          alt=""
          className="sm:absolute w-full h-full sm:top-[50%] sm:left-[50%] sm:-translate-x-[50%] sm:-translate-y-[50%] pointer-events-none"
          loading="lazy"
        />
        <div id="open-source" className="anchor anchor--open-source relative">
          <div className="h-14 w-14 mb-5">
            <Image
              src="/images/Hiero-Icon-Heart.svg"
              alt=""
              width={56}
              height={56}
              loading="lazy"
            />
          </div>
          <h2 className="text-2xl font-medium mb-5">{data.whyHeading}</h2>
          <p className="text-base max-w-[565px]">{data.whyText}</p>
        </div>
        <div className="relative">
          <div className="h-14 w-14 mb-5">
            <Image
              src="/images/Hiero-Icon-OpenSource.svg"
              alt=""
              width={56}
              height={56}
              loading="lazy"
            />
          </div>
          <h2 className="text-2xl font-medium mb-5">{data.whatHeading}</h2>
          <p
            className="text-base max-w-[565px]"
            dangerouslySetInnerHTML={{ __html: data.whatText }}
          />
        </div>
      </div>
    </div>
  );
}
