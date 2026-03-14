import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSection from "@/components/HeroSection";

describe("HeroSection", () => {
  it("renders heading and text", () => {
    render(
      <HeroSection
        data={{
          heading: "Welcome to Hiero",
          text: "Open source distributed ledger",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Welcome to Hiero" })).toBeInTheDocument();
    expect(screen.getByText("Open source distributed ledger")).toBeInTheDocument();
  });
});
