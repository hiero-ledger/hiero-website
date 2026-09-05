"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

interface Input {
  x: number;
  y: number;
  scroll: number;
}

const LAYERS: Record<string, (input: Input) => string> = {
  "--hero-art-x": ({ x }) => `${(x * 18).toFixed(2)}px`,
  "--hero-art-y": ({ y, scroll }) => `${(y * 12 - scroll * 52).toFixed(2)}px`,
  "--hero-art-rotate-x": ({ y, scroll }) =>
    `${(y * -2.75 + scroll * 1.5).toFixed(2)}deg`,
  "--hero-art-rotate-y": ({ x }) => `${(x * 5).toFixed(2)}deg`,
  "--hero-traces-x": ({ x }) => `${(x * -13).toFixed(2)}px`,
  "--hero-traces-y": ({ y, scroll }) =>
    `${(y * -9 - scroll * 34).toFixed(2)}px`,
  "--hero-halo-x": ({ x }) => `${(x * 8).toFixed(2)}px`,
  "--hero-halo-y": ({ y, scroll }) => `${(y * 6 - scroll * 18).toFixed(2)}px`,
  "--hero-scroll-progress": ({ scroll }) => scroll.toFixed(3),
};

/**
 * The mark itself, drawn twice: once as the echo behind the plane and once as
 * the emblem on it. Local to the scene on purpose — the other places the icon
 * appears (`Divider`, the 404 page) size and label it differently, so a shared
 * component would be a prop bag, not a reuse.
 */
function HieroMark() {
  return (
    <Image
      src="/images/Hiero-Icon.svg"
      alt=""
      width={540}
      height={529}
      className="hero-mark-image"
      priority
    />
  );
}

/**
 * A brand-led network object for the right side of the hero.
 *
 * The real Hiero mark is set into a translucent ledger plane, with rails and
 * event nodes carrying the existing gossip-field language through the object.
 * Everything is decorative. Pointer and scroll input only update the custom
 * properties above, so the composition still makes sense before hydration and
 * with motion or JavaScript disabled.
 */
export default function HieroMarkScene() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = sceneRef.current?.closest<HTMLElement>(".hero-section");

    if (!hero) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    const input: Input = { x: 0, y: 0, scroll: 0 };

    const scheduleDraw = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;

        for (const [property, follow] of Object.entries(LAYERS)) {
          hero.style.setProperty(property, follow(input));
        }
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const bounds = hero.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;

      input.x = clamp(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -1,
        1,
      );
      input.y = clamp(
        ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
        -1,
        1,
      );
      scheduleDraw();
    };

    const handlePointerLeave = () => {
      input.x = 0;
      input.y = 0;
      scheduleDraw();
    };

    const handleScroll = () => {
      const bounds = hero.getBoundingClientRect();
      input.scroll = clamp(-bounds.top / Math.max(bounds.height, 1), 0, 1);
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

      for (const property of Object.keys(LAYERS)) {
        hero.style.removeProperty(property);
      }
    };
  }, []);

  return (
    <div ref={sceneRef} className="hero-mark-scene" aria-hidden="true">
      <div className="hero-mark-reactive">
        <div className="hero-mark-grid" />

        {["top", "middle", "bottom"].map(rail => (
          <span
            key={rail}
            className={`hero-mark-rail hero-mark-rail--${rail}`}
          />
        ))}

        <div className="hero-mark-echo">
          <HieroMark />
        </div>
        <div className="hero-mark-emblem">
          <HieroMark />
        </div>

        {["one", "two", "three", "four"].map(node => (
          <span
            key={node}
            className={`hero-mark-node hero-mark-node--${node}`}
          />
        ))}
      </div>
    </div>
  );
}
