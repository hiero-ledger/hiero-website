import Image from "next/image";

export default function Divider() {
  return (
    <div className="container py-[40px] sm:py-0 flex flex-row items-center gap-10">
      <Image
        src="/images/Hiero-Icon.svg"
        alt=""
        width={40}
        height={40}
        loading="lazy"
      />
      <div className="w-full bg-white-dark h-[1px]" />
    </div>
  );
}
