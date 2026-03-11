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
        className={`${isOpen ? "active-navigation" : "hidden"} fixed inset-0 z-50 flex-col items-center justify-start overflow-y-auto bg-black px-6 pt-24 pb-10 text-white sm:relative sm:inset-auto sm:z-auto sm:h-auto sm:w-9/12 sm:max-w-xl sm:flex sm:flex-row sm:items-center sm:justify-end sm:overflow-visible sm:bg-transparent sm:px-0 sm:pt-0 sm:pb-0 sm:text-inherit`}
        aria-hidden={!isOpen && pathname !== undefined}
      >
        <div className="absolute top-[27px] left-6 sm:hidden">
          <Image
            src="/images/Hiero-Icon-wLogo-white-text.svg"
            alt="Hiero logo"
            className="h-[40px] w-[128px]"
            width={128}
            height={40}
          />
        </div>

        <button
          type="button"
          className="absolute text-white top-[35px] right-[25px] sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <Image src="/images/Hiero-Icon-ModalClose.svg" alt="Close menu" className="w-5 h-5" width={20} height={20} />
        </button>

        <ul id="menu" className="flex w-full flex-col items-stretch gap-2 pt-10 sm:w-auto sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:pt-0">
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
                  className="block rounded-md px-3 py-2 sm:inline sm:rounded-none sm:px-0 sm:py-0"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={`${isActive(item.href) ? "active" : ""} block rounded-md px-3 py-2 sm:inline sm:rounded-none sm:px-0 sm:py-0`.trim()}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}

          <li className="mt-4 self-center sm:mt-0">
            <a
              href="https://github.com/hiero-ledger/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center rounded-md px-3 py-2 sm:px-0 sm:py-0"
            >
              <Image
                src="/images/Hiero-Icon-Github.svg"
                alt="GitHub"
                className="h-[35px] w-[35px] sm:h-[17px] sm:w-[17px]"
                width={35}
                height={35}
              />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
