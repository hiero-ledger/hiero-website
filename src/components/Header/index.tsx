"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Menu from "@/components/Menu";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const previousScrollY = useRef(0);

  useEffect(() => {
    previousScrollY.current = Math.max(window.scrollY, 0);
    setIsScrolled(previousScrollY.current > 0);

    const handleScroll = () => {
      const currentScrollY = Math.max(window.scrollY, 0);

      if (currentScrollY !== previousScrollY.current) {
        setIsVisible(
          currentScrollY === 0 || currentScrollY < previousScrollY.current,
        );
        setIsScrolled(currentScrollY > 0);
        previousScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`h-22.5 flex items-center fixed inset-x-0 top-0 z-50 border-b bg-white/80 backdrop-blur-xl transition-[translate,border-color,box-shadow] duration-300 ease-in-out motion-reduce:transition-none ${isScrolled ? "border-charcoal/10 shadow-[0_8px_30px_rgba(30,30,30,0.06)]" : "border-transparent"} ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <Container>
        <div className="flex flex-row justify-between items-center">
          <Link
            href="/"
            aria-label="Go to homepage"
            className="rounded-lg transition-opacity duration-200 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-4">
            {/* Sized by height with `w-auto`: this mark's viewBox is cropped to
                the artwork, so pinning both axes would stretch it. Intrinsic
                dimensions match the footer's copy of the same artwork.
                34px is the height the old padded logo's artwork actually
                rendered at (40px box x 17.05/20 of viewBox), so swapping in the
                cropped file changes the background and nothing else. */}
            <Image
              src="/images/Hiero-Logo-wText.svg"
              alt="Hiero logo"
              width={207}
              height={60}
              className="h-8 w-auto md:h-8.5"
            />
          </Link>
          <Menu />
        </div>
      </Container>
    </div>
  );
}
