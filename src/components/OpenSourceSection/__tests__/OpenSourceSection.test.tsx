import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OpenSourceSection from "../OpenSourceSection";

describe("OpenSourceSection", () => {
  it("renders headings and markdown links", () => {
    render(
      <OpenSourceSection
        data={{
          whyHeading: "Why open source",
          whyText: "It keeps governance transparent.",
          whatHeading: "What contributors do",
          whatText: "Read the [guide](/guide) and start contributing.",
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Why open source" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "What contributors do" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "guide" })).toHaveAttribute(
      "href",
      "/guide",
    );
  });
});
