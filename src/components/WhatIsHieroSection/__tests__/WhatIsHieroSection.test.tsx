import { act, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WhatIsHieroSection from "..";

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

/**
 * Both effects build an observer, so the mock hands back every callback it was
 * constructed with and the tests drive whichever one they mean to.
 */
function mockIntersectionObserver() {
  const callbacks: IntersectionObserverCallback[] = [];
  const observed: Element[] = [];
  const disconnect = vi.fn();
  const unobserve = vi.fn();

  class IntersectionObserverMock {
    constructor(callback: IntersectionObserverCallback) {
      callbacks.push(callback);
    }

    observe = (element: Element) => observed.push(element);
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

  return {
    callbacks,
    observed,
    disconnect,
    unobserve,
    restore: () => Reflect.deleteProperty(window, "IntersectionObserver"),
  };
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

  it("marks the entry the reader has reached, and only that one", () => {
    const observer = mockIntersectionObserver();

    render(<WhatIsHieroSection data={data} />);

    const index = screen.getByRole("navigation", { name: "What is Hiero?" });
    const [first, second] = within(index).getAllByRole("link");

    expect(first).toHaveAttribute("aria-current", "true");
    expect(second).not.toHaveAttribute("aria-current");

    act(() => {
      observer.callbacks[0](
        [reached("hiero-is-leaderless")],
        {} as IntersectionObserver,
      );
    });

    expect(second).toHaveAttribute("aria-current", "true");
    expect(first).not.toHaveAttribute("aria-current");

    observer.restore();
  });

  it("reveals each entry as it is reached rather than all at once", () => {
    const observer = mockIntersectionObserver();

    render(<WhatIsHieroSection data={data} />);

    const section = screen.getByRole("region", { name: "What is Hiero?" });
    const entry = document.getElementById("hiero-is-open");

    expect(section).toHaveAttribute("data-motion", "ready");
    expect(entry).not.toHaveAttribute("data-revealed");

    act(() => {
      observer.callbacks[1](
        [reached("hiero-is-open")],
        {} as IntersectionObserver,
      );
    });

    expect(entry).toHaveAttribute("data-revealed", "true");
    expect(observer.unobserve).toHaveBeenCalledWith(entry);
    expect(document.getElementById("hiero-is-leaderless")).not.toHaveAttribute(
      "data-revealed",
    );

    observer.restore();
  });
});
