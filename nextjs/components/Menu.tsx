"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = {
  name: string;
  href: string;
  external?: boolean;
};

const menuItems: MenuItem[] = [
  {
    name: "Good First Issues",
    href: "https://github.com/issues?q=is%3Aopen%20is%3Aissue%20org%3Ahiero-ledger%20archived%3Afalse%20no%3Aassignee%20(label%3A%22good%20first%20issue%22%20OR%20label%3A%22skill%3A%20good%20first%20issue%22)%20(repo%3Ahiero-ledger%2Fhiero-sdk-cpp%20OR%20repo%3Ahiero-ledger%2Fhiero-sdk-swift%20OR%20repo%3Ahiero-ledger%2Fhiero-sdk-python%20OR%20repo%3Ahiero-ledger%2Fhiero-sdk-js%20OR%20repo%3Ahiero-ledger%2Fhiero-website)",
    external: true,
  },
  { name: "Connect", href: "/#connect" },
  { name: "Blog", href: "/blog" },
  {
    name: "Calendar",
    href: "https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week",
    external: true,
  },
];

export default function Menu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string): boolean => {
    if (href.startsWith("http")) return false;
    if (href.startsWith("/#")) return pathname === "/";
    if (href === "/blog") return pathname === "/blog" || pathname.startsWith("/blog/");
    return pathname === href;
  };

  return (
    <>
      <button
        type="button"
        className="sm:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Image src="/images/Hiero-Icon-Nav-Menu.svg" alt="Open menu" className="w-5 h-5" width={20} height={20} />
      </button>

      <nav
        id="navigation"
        className={`${isOpen ? "active-navigation" : "hidden"} absolute items-center justify-center w-full h-screen bg-black top-0 left-0 text-white sm:relative sm:h-auto sm:top-auto sm:bg-transparent sm:left-auto sm:w-9/12 sm:max-w-xl sm:block`}
        aria-hidden={!isOpen && pathname !== undefined}
      >
        <div className="absolute top-[27px] sm:hidden">
          <Image src="/images/Hiero-Icon-wLogo-white-text.svg" alt="Hiero logo" className="h-[40px] w-[128px]" width={128} height={40} />
        </div>

        <button
          type="button"
          className="absolute text-white top-[35px] right-[25px] sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <Image src="/images/Hiero-Icon-ModalClose.svg" alt="Close menu" className="w-5 h-5" width={20} height={20} />
        </button>

        <ul id="menu" className="flex flex-col sm:flex-row justify-between">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`text-center sm:text-left ${item.name === "Connect" ? "sm:hidden" : ""}`.trim()}
            >
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <Link href={item.href} className={isActive(item.href) ? "active" : ""} onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              )}
            </li>
          ))}

          <li className="self-center">
            <a href="https://github.com/hiero-ledger/" target="_blank" rel="noopener noreferrer" className="flex">
              <Image src="/images/Hiero-Icon-Github.svg" alt="GitHub" className="h-[35px] w-[35px] sm:h-[17px] sm:w-[17px]" width={35} height={35} />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
