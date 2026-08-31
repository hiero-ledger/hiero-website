import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HieroMarkScene from "../HieroMarkScene";

const bounds = (top = 0): DOMRect =>
  ({
    x: 0,
    y: top,
    top,
    right: 1000,
    bottom: top + 600,
    left: 0,
    width: 1000,
    height: 600,
    toJSON: () => ({}),
  }) as DOMRect;

describe("HieroMarkScene", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("responds to pointer position and hero scroll depth", () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback);
        return frames.length;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());

    const { container } = render(
      <section className="hero-section">
        <HieroMarkScene />
      </section>,
    );
    const hero = container.querySelector<HTMLElement>(".hero-section")!;
    const getBounds = vi
      .spyOn(hero, "getBoundingClientRect")
      .mockReturnValue(bounds());
    const flushFrame = () => {
      const pending = frames.splice(0);
      act(() => pending.forEach(callback => callback(16)));
    };

    flushFrame();
    fireEvent.pointerMove(hero, {
      pointerType: "mouse",
      clientX: 1000,
      clientY: 0,
    });
    flushFrame();

    expect(hero.style.getPropertyValue("--hero-art-x")).toBe("18.00px");
    expect(hero.style.getPropertyValue("--hero-art-rotate-y")).toBe("5.00deg");
    expect(hero.style.getPropertyValue("--hero-traces-x")).toBe("-13.00px");

    getBounds.mockReturnValue(bounds(-300));
    fireEvent.scroll(window);
    flushFrame();

    expect(hero.style.getPropertyValue("--hero-scroll-progress")).toBe("0.500");
    expect(hero.style.getPropertyValue("--hero-art-y")).toBe("-38.00px");

    fireEvent.pointerLeave(hero);
    flushFrame();

    expect(hero.style.getPropertyValue("--hero-art-x")).toBe("0.00px");
  });

  it("does not attach interactive motion when reduced motion is preferred", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
    } as MediaQueryList);
    const requestFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", requestFrame);

    const { container } = render(
      <section className="hero-section">
        <HieroMarkScene />
      </section>,
    );
    const hero = container.querySelector<HTMLElement>(".hero-section")!;

    fireEvent.pointerMove(hero, {
      pointerType: "mouse",
      clientX: 1000,
      clientY: 0,
    });

    expect(requestFrame).not.toHaveBeenCalled();
    expect(hero.style.getPropertyValue("--hero-art-x")).toBe("");
  });
});
