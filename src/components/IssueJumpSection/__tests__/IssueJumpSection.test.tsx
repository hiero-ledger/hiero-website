import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IssueJumpSection from "..";

describe("IssueJumpSection", () => {
  it("renders difficulty cards with external and internal links", () => {
    render(
      <IssueJumpSection
        data={{
          heading: "Jump In",
          text: "Choose a good first issue.",
          difficulties: [
            {
              label: "Beginner",
              description: "Friendly starting point",
              href: "https://github.com/hiero-ledger/hiero-website/issues",
            },
            {
              label: "Offline",
              description: "Missing URL becomes a safe fallback",
              href: "/internal-only",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Jump In" }),
    ).toBeInTheDocument();
    const externalLink = screen.getByRole("link", { name: /Beginner/i });
    const internalLink = screen.getByRole("link", { name: /Offline/i });

    expect(externalLink).toHaveAttribute(
      "href",
      "https://github.com/hiero-ledger/hiero-website/issues",
    );
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer nofollow");
    expect(internalLink).toHaveAttribute("href", "/internal-only");
    expect(internalLink).not.toHaveAttribute("target");
    expect(internalLink).not.toHaveAttribute("rel");
  });
});
