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

  /* Which heading is active is a question about layout, and jsdom has none:
     every rect it reports is zero. The tracking itself is covered in
     e2e/blog.spec.ts, in a browser that can actually scroll. What is worth
     pinning here is that the listener is attached and cleaned up. */
  it("listens for scroll while it has headings on the page, and stops on unmount", () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");

    for (const heading of headings) {
      const element = document.createElement("h2");
      element.id = heading.id;
      document.body.append(element);
    }

    const { unmount } = render(<ArticleContents headings={headings} />);

    expect(add.mock.calls.map(([event]) => event)).toContain("scroll");

    unmount();

    expect(remove.mock.calls.map(([event]) => event)).toContain("scroll");

    add.mockRestore();
    remove.mockRestore();
    document.body.replaceChildren();
  });

  it("does nothing when none of its headings are on the page", () => {
    const add = vi.spyOn(window, "addEventListener");

    render(<ArticleContents headings={headings} />);

    expect(add.mock.calls.map(([event]) => event)).not.toContain("scroll");

    add.mockRestore();
  });
});
