"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

/**
 * A brand-led network object for the right side of the hero.
 *
 * The real Hiero mark is set into a translucent ledger plane, with rails and
 * event nodes carrying the existing gossip-field language through the object.
 * Everything is decorative. Pointer and scroll input only update CSS custom
 * properties on the server-rendered hero, so the composition still makes sense
 * before hydration and with motion or JavaScript disabled.
 */
export default function HieroMarkScene() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const hero = scene?.closest<HTMLElement>(".hero-section");

    if (!scene || !hero) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollProgress = 0;

    const draw = () => {
      frameId = 0;

      hero.style.setProperty("--hero-art-x", `${(pointerX * 18).toFixed(2)}px`);
      hero.style.setProperty(
        "--hero-art-y",
        `${(pointerY * 12 - scrollProgress * 52).toFixed(2)}px`,
      );
      hero.style.setProperty(
        "--hero-art-rotate-x",
        `${(pointerY * -2.75 + scrollProgress * 1.5).toFixed(2)}deg`,
      );
      hero.style.setProperty(
        "--hero-art-rotate-y",
        `${(pointerX * 5).toFixed(2)}deg`,
      );
      hero.style.setProperty(
        "--hero-traces-x",
        `${(pointerX * -13).toFixed(2)}px`,
      );
      hero.style.setProperty(
        "--hero-traces-y",
        `${(pointerY * -9 - scrollProgress * 34).toFixed(2)}px`,
      );
      hero.style.setProperty("--hero-halo-x", `${(pointerX * 8).toFixed(2)}px`);
      hero.style.setProperty(
        "--hero-halo-y",
        `${(pointerY * 6 - scrollProgress * 18).toFixed(2)}px`,
      );
      hero.style.setProperty(
        "--hero-scroll-progress",
        scrollProgress.toFixed(3),
      );
    };

    const scheduleDraw = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const bounds = hero.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;

      pointerX = clamp(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -1,
        1,
      );
      pointerY = clamp(
        ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
        -1,
        1,
      );
      scheduleDraw();
    };

    const handlePointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      scheduleDraw();
    };

    const handleScroll = () => {
      const bounds = hero.getBoundingClientRect();
      scrollProgress = clamp(-bounds.top / Math.max(bounds.height, 1), 0, 1);
      scheduleDraw();
    };

    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      for (const property of [
        "--hero-art-x",
        "--hero-art-y",
        "--hero-art-rotate-x",
        "--hero-art-rotate-y",
        "--hero-traces-x",
        "--hero-traces-y",
        "--hero-halo-x",
        "--hero-halo-y",
        "--hero-scroll-progress",
      ]) {
        hero.style.removeProperty(property);
      }
    };
  }, []);

  return (
    <div ref={sceneRef} className="hero-mark-scene" aria-hidden="true">
      <div className="hero-mark-reactive">
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
    </div>
  );
}
