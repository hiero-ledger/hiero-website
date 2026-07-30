"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  isExternalLink,
  menuItems,
  opensInNewTab,
  socialLinks,
  withNewTabHint,
} from "@/data/navigation";

export default function Menu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);

      if (desktop) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = !isDesktop && isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDesktop, isOpen]);

  const isActive = (href: string): boolean => {
    const normalize = (value: string) =>
      value !== "/" && value.endsWith("/") ? value.slice(0, -1) : value;

    if (href.startsWith("http")) return false;
    if (href.startsWith("/#")) return false;

    const current = normalize(pathname);
    const target = normalize(href);
    if (target === "/blog")
      return current === "/blog" || current.startsWith("/blog/");
    return current === target;
  };

  const linkClass = (active: boolean) =>
    [
      "block rounded-full no-underline transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "px-5 py-3 text-xl focus-visible:ring-red-light focus-visible:ring-offset-charcoal",
      "md:px-3.5 md:py-2 md:text-sm md:focus-visible:ring-red md:focus-visible:ring-offset-white",
      active
        ? "font-semibold bg-white/10 text-white md:bg-red/10 md:text-red"
        : "text-white/80 hover:bg-white/10 hover:text-white md:text-charcoal md:hover:bg-charcoal/5 md:hover:text-red",
    ].join(" ");

  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-charcoal/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 md:hidden"
        onClick={() => {
          setIsOpen(true);
        }}
        aria-label="Open menu"
        aria-expanded={isOpen}>
        <Image
          src="/images/Hiero-Icon-Nav-Menu.svg"
          alt="Open menu"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      </button>

      <nav
        id="navigation"
        className={`fixed inset-0 z-40 flex h-screen w-full flex-col items-center justify-center bg-charcoal text-white transition-[opacity,translate,visibility] duration-300 ease-out md:visible md:pointer-events-auto md:relative md:z-auto md:h-auto md:w-auto md:translate-y-0 md:flex-row md:bg-transparent md:text-charcoal md:opacity-100 md:transition-none ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-3 opacity-0"}`}
        aria-hidden={isDesktop ? false : !isOpen}>
        <div className="absolute left-6 top-7 md:hidden">
          <Image
            src="/images/Hiero-Icon-wLogo-white-text.svg"
            alt="Hiero logo"
            width={128}
            height={40}
            className="h-10 w-32"
          />
        </div>

        <button
          type="button"
          className="absolute right-6 top-7 inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal md:hidden"
          onClick={() => {
            setIsOpen(false);
          }}
          aria-label="Close menu">
          <Image
            src="/images/Hiero-Icon-ModalClose.svg"
            alt="Close menu"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </button>

        <ul
          id="menu"
          className="flex w-full flex-col items-center gap-2 px-6 md:w-auto md:flex-row md:gap-1 md:px-0">
          {menuItems.map(item => {
            const active = isActive(item.href);
            const isExternal = isExternalLink(item);
            const openInNewTab = opensInNewTab(item);

            return (
              <li
                key={item.name}
                className={`w-full text-center md:w-auto md:text-left ${item.name === "Connect" ? "md:hidden" : ""}`.trim()}>
                {isExternal ? (
                  <a
                    href={item.href}
                    target={openInNewTab ? "_blank" : undefined}
                    rel={openInNewTab ? "noopener noreferrer" : undefined}
                    className={linkClass(active)}
                    aria-current={active ? "page" : undefined}
                    aria-label={
                      openInNewTab ? withNewTabHint(item.name) : undefined
                    }
                    onClick={() => {
                      setIsOpen(false);
                    }}>
                    {item.name}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={linkClass(active)}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      setIsOpen(false);
                    }}>
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}

          <li className="self-center flex items-center gap-2">
            {socialLinks.map(social => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={withNewTabHint(social.name)}
                className="flex">
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={35}
                  height={35}
                  className="h-[35px] w-[35px] sm:h-[17px] sm:w-[17px]"
                />
              </a>
            ))}
          </li>
        </ul>
      </nav>
    </>
  );
}
