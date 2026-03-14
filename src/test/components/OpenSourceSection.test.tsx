import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OpenSourceSection from "@/components/OpenSourceSection";

describe("OpenSourceSection", () => {
  it("renders why and what content", () => {
    render(
      <OpenSourceSection
        data={{
          whyHeading: "Why",
          whyText: "Because transparency matters.",
          whatHeading: "What",
          whatText: "Everything in [GitHub](https://github.com/hiero-ledger).",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Why" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/hiero-ledger",
    );
  });
});
