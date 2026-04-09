import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ShareButtons from "..";

describe("ShareButtons", () => {
  it("builds share links from the current page url and title", () => {
    document.title = "Shareable Post";
    window.history.pushState({}, "", "/blog/shareable-post");

    render(<ShareButtons />);

    expect(screen.getByLabelText("Share on LinkedIn")).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(window.location.href)),
    );
    expect(screen.getByLabelText("Share on X")).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(document.title)),
    );
    expect(screen.getByLabelText("Share on Email")).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:?subject="),
    );
  });
});
