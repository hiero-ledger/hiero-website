import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import ShareButtons from "@/components/ShareButtons";

describe("ShareButtons", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/blog/post-1");
    document.title = "A Blog Post";
  });

  it("renders all network share links", () => {
    render(<ShareButtons />);

    expect(screen.getByLabelText("Share on LinkedIn")).toHaveAttribute("href", expect.stringContaining("linkedin.com"));
    expect(screen.getByLabelText("Share on Twitter")).toHaveAttribute("href", expect.stringContaining("twitter.com"));
    expect(screen.getByLabelText("Share on Telegram")).toHaveAttribute("href", expect.stringContaining("t.me/share/url"));
    expect(screen.getByLabelText("Share on Email")).toHaveAttribute("href", expect.stringContaining("mailto:"));
  });
});
