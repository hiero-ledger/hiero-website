import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSection from "../HeroSection";

describe("HeroSection", () => {
  it("renders the hero heading and text", () => {
    const { container } = render(
      <HeroSection
        data={{
          heading: "Build with Hiero",
          text: "Open source, open governance.",
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Build with Hiero" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Open source, open governance."),
    ).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
