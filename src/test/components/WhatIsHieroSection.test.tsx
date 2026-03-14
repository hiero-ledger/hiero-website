import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WhatIsHieroSection from "@/components/WhatIsHieroSection";

describe("WhatIsHieroSection", () => {
  it("renders intro and points", () => {
    render(
      <WhatIsHieroSection
        data={{
          heading: "What is Hiero?",
          text: "Hiero is open source.",
          points: [
            {
              heading: "Hiero is **fair**",
              text: "Everyone gets equal access.",
              icon: "/images/icon.svg",
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "What is Hiero?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Hiero is fair/i })).toBeInTheDocument();
    expect(screen.getByText("Everyone gets equal access.")).toBeInTheDocument();
  });
});
