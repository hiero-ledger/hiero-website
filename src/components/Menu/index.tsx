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
 * Presentation lives in `app/globals.css` under "Site menu" — the responsive
 * rules here run three breakpoints deep and read better as CSS than as a
 * class-string join. This file keeps the markup and the behaviour.
 */

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
   * widths, and the gap changes at each breakpoint.
   *
   * Without ResizeObserver the rule still appears — the pathname effect below
   * measures on mount regardless — but `placed` never flips, so it arrives
   * without the fade rather than sliding in from the left edge.
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

const linkClass = (active: boolean) =>
  active ? "menu-link menu-link--active" : "menu-link";

/**
 * Three copies of the same two glyphs: the overlay's, the bar's resting one,
 * and the one that fades in over it on hover. See "Site menu" in globals.css.
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
    <span aria-hidden="true" className="menu-social-icon">
      <Image
        src={iconOnDark}
        alt=""
        width={20}
        height={20}
        className="menu-social-glyph menu-social-glyph--overlay"
      />
      <Image
        src={icon}
        alt=""
        width={20}
        height={20}
        className="menu-social-glyph menu-social-glyph--rest"
      />
      <Image
        src={iconOnDark}
        alt=""
        width={20}
        height={20}
        className="menu-social-glyph menu-social-glyph--hover"
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
        className="menu-toggle"
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
        className={`menu-nav ${isOpen ? "menu-nav--open" : "menu-nav--closed"}`}
        aria-hidden={isDesktop ? false : !isOpen}>
        <div className="menu-brand">
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
          className="menu-close"
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
          className="menu-list"
          onPointerLeave={settle}
          // The keyboard counterpart to `onPointerLeave`. Without it the rule
          // stays parked on the last link that held focus, so after tabbing out
          // of the bar it marks a page the reader is not on. React's onBlur is
          // focusout, so one handler on the list covers every link inside it;
          // relatedTarget lets us ignore focus moving between them.
          onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) settle();
          }}>
          <span
            aria-hidden="true"
            style={
              rule
                ? { width: rule.width, transform: `translateX(${rule.left}px)` }
                : { width: 0 }
            }
            className={[
              "menu-rule",
              rule && "menu-rule--visible",
              placed && "menu-rule--animated",
            ]
              .filter(Boolean)
              .join(" ")}
          />
          {menuItems.map(item => {
            const active = isActive(item.href);
            const isExternal = isExternalLink(item);
            const openInNewTab = opensInNewTab(item);

            return (
              <li
                key={item.name}
                className={`menu-item ${item.name === "Connect" ? "menu-item--overlay-only" : ""}`.trim()}>
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

          <li className="menu-social-group">
            {socialLinks.map(social => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={withNewTabHint(social.name)}
                className="menu-social">
                <SocialIcon icon={social.icon} iconOnDark={social.iconOnDark} />
                <span className="menu-social-name">{social.name}</span>
              </a>
            ))}
          </li>
        </ul>
      </nav>
    </>
  );
}
