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
});
