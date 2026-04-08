import Image from "next/image";
import RichText from "@/components/RichText";

interface OpenSourceData {
  whatHeading: string;
  whatText: string;
}

interface OpenSourceSectionProps {
  data: OpenSourceData;
}

export default function OpenSourceSection({ data }: OpenSourceSectionProps) {
  return (
    <div className="bg-white">
      <div className="container mx-auto pt-[40px] pb-[40px] sm:pt-[92px] sm:pb-[154px] grid grid-cols-1 gap-[40px]">
        
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

          <h2 className="text-2xl font-medium mb-5">
            {data.whatHeading}
          </h2>

          <RichText
            inline
            markdown={data.whatText}
            className="text-base max-w-[565px]"
          />
        </div>

      </div>
    </div>
  );
}