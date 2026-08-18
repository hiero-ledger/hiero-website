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

  const barClass = [
    "site-header",
    isScrolled ? "site-header--scrolled" : "",
    isVisible ? "" : "site-header--hidden",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      // Hiding the bar only translates it off-screen; its links stay in the tab
      // order. Reveal it as soon as focus lands inside, so a keyboard reader
      // never lands on a control they cannot see (WCAG 2.4.11). `focusin`
      // bubbles, so one handler on the bar covers everything within it.
      onFocus={() => setIsVisible(true)}
      className={barClass}>
      <Container>
        <div className="site-header-row">
          <Link
            href="/"
            aria-label="Go to homepage"
            className="site-header-brand">
            {/* Intrinsic dimensions match the footer's copy of the same
                artwork; see `.site-header-logo` for why it is sized by height. */}
            <Image
              src="/images/Hiero-Logo-wText.svg"
              alt="Hiero logo"
              width={207}
              height={60}
              className="site-header-logo"
            />
          </Link>
          <Menu />
        </div>
      </Container>
    </div>
  );
}
