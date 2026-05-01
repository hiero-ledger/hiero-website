import Image from "next/image";

export default function Divider() {
  return (
    <div className="container py-[40px] sm:py-0 flex flex-row items-center gap-10">
      <Image
        src="/images/Hiero-Icon.svg"
        alt=""
        width={68}
        height={67}
        className="w-10 h-auto shrink-0"
        loading="lazy"
      />
      <div className="w-full bg-white-dark h-[1px]" />
    </div>
  );
}
