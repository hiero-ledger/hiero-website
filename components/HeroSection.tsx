type HeroData = {
  heading: string;
  text: string;
};

type HeroSectionProps = {
  data: HeroData;
};

export default function HeroSection({ data }: HeroSectionProps) {
  return (
    <div id="hero" className="bg-linear-to-br from-red-dark via-red to-red relative">
      <div className="container py-20 sm:py-36 text-white text-center">
        <h1 className="text-4xl sm:text-5xl leading-none relative mb-2.5">
          {data.heading}
        </h1>
        <p className="text-[24px] tracking-[-0.081rem] sm:text-xl relative">
          {data.text}
        </p>
      </div>
    </div>
  );
}

