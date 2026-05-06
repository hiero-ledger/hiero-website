import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OpenSourceSection from "..";

describe("OpenSourceSection", () => {
  it("renders headings and markdown links", () => {
    render(
      <OpenSourceSection
        data={{
          whatHeading: "What contributors do",
          whatText: "Read the [guide](/guide) and start contributing.",
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "What contributors do" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "guide" })).toHaveAttribute(
      "href",
      "/guide",
    );
  });
});
