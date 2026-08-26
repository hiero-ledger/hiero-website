import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroTraces from "../HeroTraces";

describe("HeroTraces", () => {
  it("draws a field of events and the links between them", () => {
    const { container } = render(<HeroTraces />);

    expect(container.querySelectorAll("circle").length).toBeGreaterThan(20);
    expect(container.querySelectorAll("line").length).toBeGreaterThan(10);
  });

  it("draws the same field every time, so the server and the browser agree", () => {
    const first = render(<HeroTraces />).container.innerHTML;
    const second = render(<HeroTraces />).container.innerHTML;

    expect(first).toBe(second);
  });

  it("links only events that are near each other", () => {
    const { container } = render(<HeroTraces />);

    for (const line of container.querySelectorAll("line")) {
      const dx =
        Number(line.getAttribute("x2")) - Number(line.getAttribute("x1"));
      const dy =
        Number(line.getAttribute("y2")) - Number(line.getAttribute("y1"));

      expect(Math.hypot(dx, dy)).toBeLessThan(210);
    }
  });

  it("stays out of the accessibility tree", () => {
    const { container } = render(<HeroTraces />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).toHaveAttribute("focusable", "false");
  });
});
