import Image from "next/image";

export default function Divider() {
  return (
    <div className="bg-sand">
      <div className="container flex flex-row items-center gap-10 py-[var(--space-band-tight)]">
        <Image
          src="/images/Hiero-Icon.svg"
          alt=""
          width={68}
          height={67}
          className="h-auto w-10 shrink-0"
          loading="lazy"
        />
        <div className="h-[1px] w-full bg-charcoal/12" />
      </div>
    </div>
  );
}
