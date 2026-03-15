import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/blog/post-1",
}));

import Menu from "@/components/Menu";

describe("Menu", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { value: 390, writable: true });
  });

  it("opens and closes mobile navigation", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    const openButton = screen.getByRole("button", { name: "Open menu" });
    await user.click(openButton);

    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("button", { name: "Close menu" })).toBeNull();
  });

  it("marks blog link as active on blog routes", () => {
    render(<Menu />);

    const blogLink = screen.getByRole("link", { name: "Blog", hidden: true });
    expect(blogLink).toHaveClass("active");
    expect(blogLink).toHaveAttribute("aria-current", "page");
  });
});
