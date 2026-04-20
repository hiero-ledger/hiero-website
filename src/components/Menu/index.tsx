"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MenuItem {
  name: string;
  href: string;
  external?: boolean;
}

const menuItems: MenuItem[] = [
  { name: "Contribute", href: "/#contribute" },
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
        className={`absolute hidden items-center justify-center w-full h-screen bg-black top-0 left-0 text-white sm:relative sm:h-auto sm:top-auto sm:bg-transparent sm:left-auto sm:w-9/12 sm:max-w-xl sm:block ${isOpen ? "active-navigation" : ""}`}
        aria-hidden={isDesktop ? false : !isOpen}>
        <div className="absolute top-[27px] sm:hidden">
          <Image
            src="/images/Hiero-Icon-wLogo-white-text.svg"
            alt="Hiero logo"
            width={128}
            height={40}
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
          <Image
            src="/images/Hiero-Icon-ModalClose.svg"
            alt="Close menu"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </button>

        <ul id="menu" className="flex flex-col sm:flex-row justify-between">
          {menuItems.map(item => {
            const active = isActive(item.href);
            const isExternal = item.external ?? item.href.startsWith("http");

            return (
              <li
                key={item.name}
                className={`text-center sm:text-left ${item.name === "Connect" ? "sm:hidden" : ""}`.trim()}>
                {isExternal ? (
                  <a
                    href={item.href}
                    className={active ? "active" : ""}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      setIsOpen(false);
                    }}>
                    {item.name}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={active ? "active" : ""}
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

          <li className="self-center">
            <a
              href="https://github.com/hiero-ledger/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex">
              <Image
                src="/images/Hiero-Icon-Github.svg"
                alt="GitHub"
                width={35}
                height={35}
                className="h-[35px] w-[35px] sm:h-[17px] sm:w-[17px]"
              />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
