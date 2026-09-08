import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ArticleHeading } from "@/lib/headings";
import ArticleContents from "..";

const headings: ArticleHeading[] = [
  { id: "what-it-is", text: "What it is", level: 2 },
  { id: "hcs-1", text: "HCS-1: File Management", level: 3 },
  { id: "get-involved", text: "Get involved", level: 2 },
];

describe("ArticleContents", () => {
  it("lists every heading as a link to its anchor", () => {
    render(<ArticleContents headings={headings} />);

    expect(
      screen.getByRole("navigation", { name: "On this page" }),
    ).toBeInTheDocument();

    for (const heading of headings) {
      expect(screen.getByRole("link", { name: heading.text })).toHaveAttribute(
        "href",
        `#${heading.id}`,
      );
    }
  });

  it("marks the first heading current before anything has been scrolled", () => {
    render(<ArticleContents headings={headings} />);

    expect(screen.getByRole("link", { name: "What it is" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(
      screen.getByRole("link", { name: "Get involved" }),
    ).not.toHaveAttribute("aria-current");
  });

  /* The nesting is carried on the item so the stylesheet can indent it; the
     list stays flat, which keeps it navigable as one list. */
  it("records each heading's level on its item", () => {
    render(<ArticleContents headings={headings} />);

    const levels = [...document.querySelectorAll(".blog-contents-list li")].map(
      item => item.getAttribute("data-level"),
    );

    expect(levels).toEqual(["2", "3", "2"]);
  });

  it("observes the headings it points at", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe = observe;
        disconnect = disconnect;
        unobserve = vi.fn();
        takeRecords = vi.fn();
        root = null;
        rootMargin = "";
        thresholds = [];
      },
    );

    // Only the targets that exist in the document can be observed.
    for (const heading of headings.slice(0, 2)) {
      const element = document.createElement("h2");
      element.id = heading.id;
      document.body.append(element);
    }

    const { unmount } = render(<ArticleContents headings={headings} />);

    expect(observe).toHaveBeenCalledTimes(2);

    unmount();

    expect(disconnect).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
