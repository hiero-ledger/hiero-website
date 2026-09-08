import { act, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import WhatIsHieroSection from "..";
import { whatIsHieroData } from "@/data/homePageData";

const data = {
  eyebrow: "Principles",
  heading: "What is Hiero?",
  text: "Hiero, a [Linux Foundation Decentralized Trust](https://www.lfdecentralizedtrust.org/) project, is vendor-neutral.",
  points: [
    {
      heading: "Hiero is **open**",
      text: "Open governance and collaboration.",
      icon: "/images/icon-1.svg",
    },
    {
      heading: "Hiero is **leaderless**",
      text: "Every node participates equally.",
      icon: "/images/icon-2.svg",
    },
  ],
};

/** A record shaped like the one an observer would hand back for `target`. */
function reached(id: string): IntersectionObserverEntry {
  const target = document.getElementById(id);

  expect(target).not.toBeNull();

  return {
    isIntersecting: true,
    target,
  } as unknown as IntersectionObserverEntry;
}

/** Undoes whatever the current test installed on `window`, run from afterEach
 *  so a failing assertion cannot leave the mock behind for the next test. */
let restoreIntersectionObserver: (() => void) | undefined;

afterEach(() => {
  restoreIntersectionObserver?.();
  restoreIntersectionObserver = undefined;
  vi.restoreAllMocks();
});

/**
 * Both effects build an observer, so the mock records every one it was
 * constructed with — with the elements that observer was actually given — and
 * the tests drive whichever one they mean to.
 *
 * The tests below index `observers` by construction order: [0] is the effect
 * that tracks which entry the reader has reached, [1] is the reveal gate. That
 * is a coupling to the order the two effects run in; if the component ever
 * reorders them, these tests pick the wrong observer.
 */
function mockIntersectionObserver() {
  const observers: Array<{
    callback: IntersectionObserverCallback;
    observed: Element[];
  }> = [];
  const disconnect = vi.fn();
  const unobserve = vi.fn();

  class IntersectionObserverMock {
    observed: Element[] = [];

    constructor(callback: IntersectionObserverCallback) {
      observers.push({ callback, observed: this.observed });
    }

    observe = (element: Element) => this.observed.push(element);
    disconnect = disconnect;
    unobserve = unobserve;
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = "0px";
    thresholds = [0];
  }

  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    value: IntersectionObserverMock,
  });

  restoreIntersectionObserver = () =>
    Reflect.deleteProperty(window, "IntersectionObserver");

  return { observers, disconnect, unobserve };
}

function pushEverythingBelowTheFold() {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    top: window.innerHeight,
  } as DOMRect);
}

describe("WhatIsHieroSection", () => {
  it("names the section by its own heading", () => {
    render(<WhatIsHieroSection data={data} />);

    expect(
      screen.getByRole("region", { name: "What is Hiero?" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Principles")).toBeVisible();
  });

  it("links out from the intro", () => {
    render(<WhatIsHieroSection data={data} />);

    const link = screen.getByRole("link", {
      name: "Linux Foundation Decentralized Trust",
    });

    expect(link).toHaveAttribute(
      "href",
      "https://www.lfdecentralizedtrust.org/",
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("keeps the whole phrase as the heading even though the property is set apart", () => {
    render(<WhatIsHieroSection data={data} />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Hiero is open" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { level: 3, name: "Hiero is leaderless" }),
    ).toBeVisible();
  });

  it("states the reason behind every property", () => {
    render(<WhatIsHieroSection data={data} />);

    data.points.forEach(point => {
      expect(screen.getByText(point.text)).toBeVisible();
    });
  });

  it("indexes the properties as jump links onto their own entries", () => {
    render(<WhatIsHieroSection data={data} />);

    const index = screen.getByRole("navigation", { name: "What is Hiero?" });
    const links = within(index).getAllByRole("link");

    expect(links.map(link => link.textContent)).toEqual(["open", "leaderless"]);

    links.forEach(link => {
      const target = document.querySelector(link.getAttribute("href") ?? "");

      expect(target).not.toBeNull();
      expect(target).toHaveTextContent("Hiero is");
    });
  });

  it("falls back to the whole heading when the copy emphasises nothing", () => {
    render(
      <WhatIsHieroSection
        data={{
          ...data,
          points: [
            {
              heading: "Hiero is everywhere",
              text: "No emphasis in this heading at all.",
              icon: "/images/icon-1.svg",
            },
          ],
        }}
      />,
    );

    const index = screen.getByRole("navigation", { name: "What is Hiero?" });
    const [link] = within(index).getAllByRole("link");

    expect(link).toHaveTextContent("Hiero is everywhere");
    // Degenerate but safe: with no emphasised half to name the entry, the whole
    // heading is slugged, which doubles the "hiero-is-" the anchor prefixes.
    // The link and its target still agree, which is all the anchor has to do.
    expect(link).toHaveAttribute("href", "#hiero-is-hiero-is-everywhere");
    expect(
      document.getElementById("hiero-is-hiero-is-everywhere"),
    ).not.toBeNull();
  });

  it("gives every entry in the real copy an anchor of its own", () => {
    const { container } = render(<WhatIsHieroSection data={whatIsHieroData} />);

    const ids = Array.from(
      container.querySelectorAll<HTMLLIElement>(".hiero-principles-item"),
    ).map(item => item.id);

    expect(ids).toHaveLength(whatIsHieroData.points.length);
    expect(ids).toHaveLength(6);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("marks the entry the reader has reached, and only that one", () => {
    const observer = mockIntersectionObserver();

    render(<WhatIsHieroSection data={data} />);

    const index = screen.getByRole("navigation", { name: "What is Hiero?" });
    const [first, second] = within(index).getAllByRole("link");

    expect(first).toHaveAttribute("aria-current", "location");
    expect(second).not.toHaveAttribute("aria-current");

    act(() => {
      observer.observers[0].callback(
        [reached("hiero-is-leaderless")],
        {} as IntersectionObserver,
      );
    });

    expect(second).toHaveAttribute("aria-current", "location");
    expect(first).not.toHaveAttribute("aria-current");
  });

  it("reveals each entry as it is reached rather than all at once", () => {
    const observer = mockIntersectionObserver();

    pushEverythingBelowTheFold();

    render(<WhatIsHieroSection data={data} />);

    const section = screen.getByRole("region", { name: "What is Hiero?" });
    const entry = document.getElementById("hiero-is-open");

    expect(section).toHaveAttribute("data-motion", "ready");
    expect(entry).not.toHaveAttribute("data-revealed");
    expect(observer.observers[1].observed).toContain(entry);

    act(() => {
      observer.observers[1].callback(
        [reached("hiero-is-open")],
        {} as IntersectionObserver,
      );
    });

    expect(entry).toHaveAttribute("data-revealed", "true");
    expect(observer.unobserve).toHaveBeenCalledWith(entry);
    expect(document.getElementById("hiero-is-leaderless")).not.toHaveAttribute(
      "data-revealed",
    );
  });

  it("reveals whatever is already on screen without waiting to be told", () => {
    // jsdom reports every rect at the origin, so every element counts as
    // already visible: the gate must reveal them on the spot rather than hide
    // content the reader is looking at until an observer fires.
    const observer = mockIntersectionObserver();

    const { container } = render(<WhatIsHieroSection data={data} />);

    const section = screen.getByRole("region", { name: "What is Hiero?" });
    const thesis = container.querySelector(".hiero-principles-thesis");
    const items = Array.from(
      container.querySelectorAll<HTMLLIElement>(".hiero-principles-item"),
    );

    expect(section).toHaveAttribute("data-motion", "ready");
    expect(thesis).toHaveAttribute("data-revealed", "true");
    items.forEach(item => {
      expect(item).toHaveAttribute("data-revealed", "true");
    });
    expect(observer.observers[1].observed).toEqual([]);
  });

  it("matches the rendered structure", () => {
    const { container } = render(<WhatIsHieroSection data={data} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
