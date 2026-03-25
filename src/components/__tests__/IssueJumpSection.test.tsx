import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IssueJumpSection from "../IssueJumpSection";

describe("IssueJumpSection", () => {
  it("renders difficulty cards and falls back invalid links to #", () => {
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
    expect(screen.getByRole("link", { name: /Beginner/i })).toHaveAttribute(
      "href",
      "https://github.com/hiero-ledger/hiero-website/issues",
    );
    expect(screen.getByRole("link", { name: /Offline/i })).toHaveAttribute(
      "href",
      "#",
    );
  });
});
