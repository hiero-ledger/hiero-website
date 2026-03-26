import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Menu from "..";

const mockNavigation = vi.hoisted(() => ({
  pathname: "/",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockNavigation.pathname,
}));

function setWindowWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    writable: true,
    configurable: true,
  });
}

describe("Menu", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("opens and closes the mobile menu and locks body scrolling", async () => {
    const user = userEvent.setup();

    mockNavigation.pathname = "/";
    setWindowWidth(500);

    const { container } = render(<Menu />);
    const nav = container.querySelector("#navigation");

    await waitFor(() => {
      expect(nav).toHaveAttribute("aria-hidden", "true");
    });

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(nav).toHaveAttribute("aria-hidden", "false");
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(screen.getByRole("button", { name: "Close menu" }));

    expect(nav).toHaveAttribute("aria-hidden", "true");
    expect(document.body.style.overflow).toBe("");
  });

  it("marks blog routes as active", async () => {
    mockNavigation.pathname = "/blog/hello-world";
    setWindowWidth(1024);

    render(<Menu />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    });
  });
});
