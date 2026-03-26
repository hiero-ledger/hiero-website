import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WhatIsHieroSection from "..";

describe("WhatIsHieroSection", () => {
  it("renders the intro and supporting points", () => {
    const { asFragment } = render(
      <WhatIsHieroSection
        data={{
          heading: "What is Hiero?",
          text: "A governance-led network.",
          points: [
            {
              heading: "**Open** governance",
              text: "The community shapes the roadmap.",
              icon: "/images/icon-1.svg",
            },
            {
              heading: "Reliable tooling",
              text: "SDKs and services are built in the open.",
              icon: "/images/icon-2.svg",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "What is Hiero?" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A governance-led network.")).toBeInTheDocument();
    expect(
      screen.getByText("The community shapes the roadmap."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("SDKs and services are built in the open."),
    ).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
