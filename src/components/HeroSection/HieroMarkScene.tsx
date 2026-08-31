import Image from "next/image";

/**
 * A brand-led network object for the right side of the hero.
 *
 * The real Hiero mark is set into a translucent ledger plane, with rails and
 * event nodes carrying the existing gossip-field language through the object.
 * Everything is decorative and CSS-driven, so the hero remains server-rendered
 * and still makes sense with motion or JavaScript disabled.
 */
export default function HieroMarkScene() {
  return (
    <div className="hero-mark-scene" aria-hidden="true">
      <div className="hero-mark-grid" />

      <span className="hero-mark-rail hero-mark-rail--top" />
      <span className="hero-mark-rail hero-mark-rail--middle" />
      <span className="hero-mark-rail hero-mark-rail--bottom" />

      <div className="hero-mark-echo">
        <Image
          src="/images/Hiero-Icon.svg"
          alt=""
          width={540}
          height={529}
          className="hero-mark-image"
          priority
        />
      </div>

      <div className="hero-mark-emblem">
        <Image
          src="/images/Hiero-Icon.svg"
          alt=""
          width={540}
          height={529}
          className="hero-mark-image"
          priority
        />
      </div>

      <span className="hero-mark-node hero-mark-node--one" />
      <span className="hero-mark-node hero-mark-node--two" />
      <span className="hero-mark-node hero-mark-node--three" />
      <span className="hero-mark-node hero-mark-node--four" />
    </div>
  );
}
