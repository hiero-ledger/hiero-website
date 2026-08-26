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
      heading: "Hiero is **reliable**",
      text: "Asynchronous Byzantine Fault Tolerant.",
      icon: "/images/icon-2.svg",
    },
  ],
};

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

  it("states every property and the reason behind it", () => {
    render(<WhatIsHieroSection data={data} />);

    const entries = screen.getAllByRole("listitem");

    expect(entries).toHaveLength(data.points.length);
    data.points.forEach((point, index) => {
      const entry = within(entries[index]);
      const name = point.heading.replaceAll("*", "");

      expect(entry.getByRole("heading", { level: 3, name })).toBeVisible();
      expect(entry.getByText(point.text)).toBeVisible();
    });
  });

  it("leaves the icons out of the accessibility tree", () => {
    render(<WhatIsHieroSection data={data} />);

    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("starts the reveal when the list enters the viewport", () => {
    let notify: IntersectionObserverCallback = () => undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();

    class IntersectionObserverMock {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }

      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = "0px";
      thresholds = [0.18];
    }

    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: IntersectionObserverMock,
    });

    const { unmount } = render(<WhatIsHieroSection data={data} />);
    const section = screen.getByRole("region", { name: "What is Hiero?" });

    expect(section).toHaveAttribute("data-motion", "ready");
    expect(observe).toHaveBeenCalledWith(section);

    act(() => {
      notify(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(section).toHaveAttribute("data-visible", "true");
    expect(disconnect).toHaveBeenCalledTimes(1);

    unmount();
    Reflect.deleteProperty(window, "IntersectionObserver");
  });
});
