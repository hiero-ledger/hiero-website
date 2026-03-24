"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MenuItem {
  name: string;
  href: string;
  external?: boolean;
}

const menuItems: MenuItem[] = [
  { name: "Contribute", href: "/#jump-to-issues" },
  { name: "Connect", href: "/#connect" },
  { name: "Blog", href: "/blog/" },
  { name: "TSC", href: "/tsc/" },
  {
    name: "Calendar",
    href: "https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week",
  },
];

export default function Menu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 640;
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

  return (
    <>
      <button
        type="button"
        className="sm:hidden"
        onClick={() => {
          setIsOpen(true);
        }}
        aria-label="Open menu"
        aria-expanded={isOpen}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Hiero-Icon-Nav-Menu.svg"
          alt="Open menu"
          className="w-5 h-5"
        />
      </button>

      <nav
        id="navigation"
        className={`absolute hidden items-center justify-center w-full h-screen bg-black top-0 left-0 text-white sm:relative sm:h-auto sm:top-auto sm:bg-transparent sm:left-auto sm:w-9/12 sm:max-w-xl sm:block ${isOpen ? "active-navigation" : ""}`}
        aria-hidden={isDesktop ? false : !isOpen}>
        <div className="absolute top-[27px] sm:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Hiero-Icon-wLogo-white-text.svg"
            alt="Hiero logo"
            className="h-[40px] w-[128px]"
          />
        </div>

        <button
          type="button"
          className="absolute text-white top-[35px] right-[25px] sm:hidden"
          onClick={() => {
            setIsOpen(false);
          }}
          aria-label="Close menu">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Hiero-Icon-ModalClose.svg"
            alt="Close menu"
            className="w-5 h-5"
          />
        </button>

        <ul id="menu" className="flex flex-col sm:flex-row justify-between">
          {menuItems.map(item => {
            return (
              <li
                key={item.name}
                className={`text-center sm:text-left ${item.name === "Connect" ? "sm:hidden" : ""}`.trim()}>
                <a
                  href={item.href}
                  className={isActive(item.href) ? "active" : ""}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => {
                    setIsOpen(false);
                  }}>
                  {item.name}
                </a>
              </li>
            );
          })}

          <li className="self-center">
            <a
              href="https://github.com/hiero-ledger/"
              target="_blank"
              rel="noopener"
              className="flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/Hiero-Icon-Github.svg"
                alt="GitHub"
                className="h-[35px] w-[35px] sm:h-[17px] sm:w-[17px]"
              />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
