import Image from "next/image";

/**
 * The seam between two sections: the Hiero mark, then a rule running out to the
 * right margin.
 *
 * It sits on `sand` rather than on the page ground. The sections it separates
 * are sand, so a transparent seam let the white body show through as a band
 * across the page — which nobody saw until recently, because the home sections
 * also carried `.anchor` and its −6.813rem margin pulled each one up over the
 * divider entirely. With that offset gone the seam is visible for the first
 * time on desktop, and it has to be painted to match its neighbours.
 *
 * For the same reason the rule is charcoal rather than `white-dark`: that token
 * is #e5e4d7, which *is* sand, so the old rule is invisible the moment the seam
 * stops standing on white.
 */
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
