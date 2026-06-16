import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ShareButtons from "..";

describe("ShareButtons", () => {
  it("builds share links from provided url and title", () => {
    const shareUrl = "https://hiero.org/blog/shareable-post";
    const shareTitle = "Shareable Post";

    render(<ShareButtons shareUrl={shareUrl} shareTitle={shareTitle} />);

    expect(screen.getByLabelText("Share on LinkedIn")).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(shareUrl)),
    );
    expect(screen.getByLabelText("Share on X")).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(shareTitle)),
    );
    expect(screen.getByLabelText("Share on Email")).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:?subject="),
    );
  });
});
