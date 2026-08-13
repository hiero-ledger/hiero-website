"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  isExternalLink,
  menuItems,
  opensInNewTab,
  socialLinks,
  withNewTabHint,
} from "@/data/navigation";

/**
 * Desktop type matches the live site exactly: `text-base` is 16px and carries
 * the -0.054rem tracking measured on hiero.org (-0.864px at 16px), at weight
 * 400 in full charcoal, with red on hover. The mobile overlay keeps `text-xl`.
 *
 * Desktop links carry no horizontal padding, so the `<ul>`'s gap *is* the
 * measured distance between labels — the same construction as the live site.
 * The pill background is gone from `md` up: the sliding rule underneath is the
 * hover affordance now, and two competing ones read as noise.
 */
const linkClass = (active: boolean) =>
  [
    // `whitespace-nowrap` matters from `md` up: the bar is a single row, and
    // "Issue Explorer" is long enough to wrap onto two lines without it.
    "block rounded-full whitespace-nowrap no-underline transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "px-5 py-3 text-xl focus-visible:ring-red-light focus-visible:ring-offset-charcoal",
    "md:rounded-sm md:px-0 md:py-2 md:text-base md:focus-visible:ring-red md:focus-visible:ring-offset-white",
    active
      ? "font-semibold bg-white/10 text-white md:bg-transparent md:font-normal md:text-red"
      : "font-medium text-white/80 hover:bg-white/10 hover:text-white md:bg-transparent md:font-normal md:text-charcoal md:hover:text-red",
  ].join(" ");

/** Horizontal extent of one label, measured relative to the list. */
interface Rule {
  left: number;
  width: number;
}

/**
 * The spec assigns `red-light` to the active-link underline. Rather than give
 * each link its own rule, one shared rule slides between them: it marks the
 * current page at rest and follows the pointer or keyboard focus, which is what
 * makes the bar feel considered rather than decorated.
 *
 * Width and offset have to be measured, so this is deliberately the only
 * JS-driven flourish in the component — and it degrades to nothing when there
 * is no active page and no pointer, rather than parking somewhere arbitrary.
 */
function useSlidingRule(pathname: string) {
  const listRef = useRef<HTMLUListElement>(null);
  const [rule, setRule] = useState<Rule | null>(null);
  // Suppresses the transition on first placement, so the rule fades in where it
  // belongs instead of sliding in from the left edge.
  const [placed, setPlaced] = useState(false);
  const placedRef = useRef(false);

  /**
   * Offsets are relative to the list, not the viewport, which is why a plain
   * window resize needs no handling: unless the list itself reflows, every
   * offset within it stays valid.
   */
  const measure = useCallback((label: Element | null): Rule | null => {
    const list = listRef.current;
    if (!list || !label) return null;
    const listBox = list.getBoundingClientRect();
    const box = label.getBoundingClientRect();
    if (box.width === 0) return null;
    return { left: box.left - listBox.left, width: box.width };
  }, []);

  /** Return the rule to the current page's label, or hide it if none is active. */
  const settle = useCallback(() => {
    setRule(
      measure(
        listRef.current?.querySelector('[data-nav-current="true"]') ?? null,
      ),
    );
  }, [measure]);

  const moveTo = useCallback(
    (link: Element | null) => {
      const next = measure(link?.querySelector("[data-nav-label]") ?? null);
      if (next) setRule(next);
    },
    [measure],
  );

  /**
   * One observer covers every reflow that can invalidate a measurement: the
   * initial layout (it fires on observe), the webfont swap that changes label
   * widths, and the gap changes at each breakpoint. Progressive enhancement —
   * without ResizeObserver the rule simply never appears.
   */
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      settle();
      if (!placedRef.current) {
        placedRef.current = true;
        setPlaced(true);
      }
    });
    observer.observe(list);

    return () => observer.disconnect();
  }, [settle]);

  // A new active page does not resize the list, so the observer stays quiet;
  // re-measure on the next frame, once the new markup has been laid out.
  useEffect(() => {
    const frame = requestAnimationFrame(settle);
    return () => cancelAnimationFrame(frame);
  }, [pathname, settle]);

  return { listRef, rule, placed, settle, moveTo };
}

/**
 * GitHub and Discord read as buttons rather than bare glyphs: icon plus name,
 * in the same font and size as the links beside them. `group` drives the icon
 * swap in `SocialIcon` — the artwork is fixed-colour SVG, so the white copy
 * has to fade in over the red one as the pill fills.
 *
 * From `md` to `lg` the pill collapses to a 36px circle and `socialLabel` hides
 * the name. At 16px link text the labelled row needs ~753px, and 1024px leaves
 * only ~606px beside the logo once the container's 140px gutters are taken, so
 * the names cannot ride along until `xl`.
 */
const socialClass = [
  "group inline-flex items-center justify-center gap-2 rounded-full border no-underline transition-[color,background-color,border-color] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  "h-11 flex-1 border-white/25 px-4 text-base leading-none text-white hover:border-transparent hover:bg-red-light focus-visible:ring-red-light focus-visible:ring-offset-charcoal",
  "md:h-9 md:w-9 md:flex-none md:border-charcoal/15 md:px-0 md:text-base md:text-charcoal md:hover:border-red md:hover:bg-red md:hover:text-white md:focus-visible:ring-red md:focus-visible:ring-offset-white",
  "xl:w-auto xl:px-3.5",
].join(" ");

/**
 * Visible on mobile (roomy overlay) and from `xl` up, hidden only in the band
 * where the row would otherwise overflow. `aria-label` on the link carries the
 * name throughout, so nothing is lost to assistive tech.
 */
const socialLabel = "inline md:hidden xl:inline";

/**
 * The two source icons have different aspect ratios (GitHub is 15x17, Discord
 * 127x96), so they are letterboxed inside a square box rather than stretched
 * to fill it — same reasoning as the footer's social row.
 *
 * Marked `aria-hidden` with empty `alt`s: the adjacent name is the accessible
 * label, so announcing the artwork too would just repeat it.
 */
function SocialIcon({
  icon,
  iconOnDark,
}: {
  icon: string;
  iconOnDark: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center md:h-4 md:w-4">
      {/* The overlay is charcoal, so mobile shows the white copy outright. */}
      <Image
        src={iconOnDark}
        alt=""
        width={20}
        height={20}
        className="h-full w-full object-contain md:hidden"
      />
      <Image
        src={icon}
        alt=""
        width={20}
        height={20}
        className="hidden h-full w-full object-contain transition-opacity duration-200 ease-out md:block md:group-hover:opacity-0 md:group-focus-visible:opacity-0"
      />
      <Image
        src={iconOnDark}
        alt=""
        width={20}
        height={20}
        className="absolute inset-0 hidden h-full w-full object-contain opacity-0 transition-opacity duration-200 ease-out md:block md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
      />
    </span>
  );
}

/**
 * The rule is measured against this span rather than the link box, so it tracks
 * the label's true extent regardless of any padding on the link.
 */
function NavLabel({ name, current }: { name: string; current: boolean }) {
  return (
    <span data-nav-label data-nav-current={current ? "true" : undefined}>
      {name}
    </span>
  );
}

export default function Menu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { listRef, rule, placed, settle, moveTo } = useSlidingRule(pathname);

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
        className={`fixed inset-0 z-40 flex h-screen w-full flex-col items-center justify-center overflow-y-auto bg-charcoal text-white transition-[opacity,translate,visibility] duration-300 ease-out md:visible md:pointer-events-auto md:relative md:z-auto md:h-auto md:w-auto md:translate-y-0 md:flex-row md:overflow-visible md:bg-transparent md:text-charcoal md:opacity-100 md:transition-none ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-3 opacity-0"}`}
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
          ref={listRef}
          // Links have no side padding from `md` up, so gap is the label-to-label
          // distance directly: `xl:gap-12` is 48px, the rhythm measured on
          // hiero.org (49px). Narrower steps tighten only as far as the row needs.
          className="relative flex w-full flex-col items-center gap-2 px-6 md:w-auto md:flex-row md:items-center md:gap-5 md:px-0 lg:gap-9 xl:gap-12"
          onPointerLeave={settle}>
          <span
            aria-hidden="true"
            style={
              rule
                ? { width: rule.width, transform: `translateX(${rule.left}px)` }
                : { width: 0 }
            }
            className={`pointer-events-none absolute bottom-1 left-0 hidden h-0.5 rounded-full bg-red-light md:block ${rule ? "opacity-100" : "opacity-0"} ${placed ? "transition-[transform,width,opacity] duration-300 ease-out motion-reduce:transition-none" : ""}`}
          />
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
                    onPointerEnter={event => moveTo(event.currentTarget)}
                    onFocus={event => moveTo(event.currentTarget)}
                    onClick={() => {
                      setIsOpen(false);
                    }}>
                    <NavLabel name={item.name} current={active} />
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={linkClass(active)}
                    aria-current={active ? "page" : undefined}
                    onPointerEnter={event => moveTo(event.currentTarget)}
                    onFocus={event => moveTo(event.currentTarget)}
                    onClick={() => {
                      setIsOpen(false);
                    }}>
                    <NavLabel name={item.name} current={active} />
                  </Link>
                )}
              </li>
            );
          })}

          <li className="mt-8 flex w-full items-center gap-3 md:mt-0 md:ml-3 md:w-auto md:gap-2 md:border-l md:border-charcoal/15 md:pl-3">
            {socialLinks.map(social => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={withNewTabHint(social.name)}
                className={socialClass}>
                <SocialIcon icon={social.icon} iconOnDark={social.iconOnDark} />
                <span className={socialLabel}>{social.name}</span>
              </a>
            ))}
          </li>
        </ul>
      </nav>
    </>
  );
}
