import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import BackToTop from "..";

describe("BackToTop", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scrolls the window back to the top when clicked", async () => {
    const scrollTo = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => undefined);
    const user = userEvent.setup();

    render(<BackToTop />);

    await user.click(screen.getByRole("button", { name: "Back to top" }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("disables smooth scrolling when reduced motion is preferred", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
    } as MediaQueryList);
    const scrollTo = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => undefined);
    const user = userEvent.setup();

    render(<BackToTop />);

    await user.click(screen.getByRole("button", { name: "Back to top" }));

    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)",
    );
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });

  it("moves focus to the top of the page so tabbing continues from there", async () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const user = userEvent.setup();

    const header = document.createElement("header");
    const headerLink = document.createElement("a");
    headerLink.href = "/";
    header.appendChild(headerLink);
    document.body.appendChild(header);

    render(<BackToTop />);

    await user.click(screen.getByRole("button", { name: "Back to top" }));

    expect(document.activeElement).toBe(headerLink);

    header.remove();
  });
});
