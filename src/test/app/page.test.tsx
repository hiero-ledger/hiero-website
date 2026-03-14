import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/HeroSection", () => ({ default: () => <div>HeroSection</div> }));
vi.mock("@/components/WhatIsHieroSection", () => ({ default: () => <div>WhatIsHieroSection</div> }));
vi.mock("@/components/Divider", () => ({ default: () => <div>Divider</div> }));
vi.mock("@/components/MeetSection", () => ({ default: () => <div>MeetSection</div> }));
vi.mock("@/components/ReposCarousel", () => ({ default: () => <div>ReposCarousel</div> }));
vi.mock("@/components/OpenSourceSection", () => ({ default: () => <div>OpenSourceSection</div> }));
vi.mock("@/components/QuotesCarousel", () => ({ default: () => <div>QuotesCarousel</div> }));
vi.mock("@/components/TSCSection", () => ({ default: () => <div>TSCSection</div> }));

import Home from "@/app/page";

describe("Home page", () => {
  it("renders all home sections", () => {
    render(<Home />);

    expect(screen.getByText("HeroSection")).toBeInTheDocument();
    expect(screen.getByText("WhatIsHieroSection")).toBeInTheDocument();
    expect(screen.getByText("MeetSection")).toBeInTheDocument();
    expect(screen.getByText("ReposCarousel")).toBeInTheDocument();
    expect(screen.getByText("OpenSourceSection")).toBeInTheDocument();
    expect(screen.getByText("QuotesCarousel")).toBeInTheDocument();
    expect(screen.getByText("TSCSection")).toBeInTheDocument();
  });
});
