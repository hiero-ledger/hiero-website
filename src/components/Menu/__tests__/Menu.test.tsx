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
    setWindowWidth(640);

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

  // The social links pair their icon with a visible name, but the accessible
  // name still comes from aria-label: it has to carry the new-tab hint, which
  // gives non-sighted users the cue the icon gives everyone else. aria-label
  // overrides the text content, so the hint cannot simply be appended.
  it("gives social links an accessible name including the new-tab hint", async () => {
    setWindowWidth(1024);

    render(<Menu />);

    await waitFor(() => {
      expect(
        screen.getByRole("link", {
          name: "GitHub (opens in a new tab)",
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", {
          name: "Discord (opens in a new tab)",
        }),
      ).toBeInTheDocument();
    });
  });

  // Guards the icon+name treatment: the name is what tells a sighted user which
  // button is which, and the icons alone are unlabelled artwork. A regression
  // that drops the span would still satisfy the aria-label test above.
  it("renders a visible name alongside each social icon", async () => {
    setWindowWidth(1024);

    render(<Menu />);

    await waitFor(() => {
      for (const name of ["GitHub", "Discord"]) {
        expect(
          screen.getByRole("link", { name: `${name} (opens in a new tab)` }),
        ).toHaveTextContent(name);
      }
    });
  });
});
