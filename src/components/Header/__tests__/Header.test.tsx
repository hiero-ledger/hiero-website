import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "..";

vi.mock("@/components/Menu", () => ({
  default: () => <div data-testid="menu">Mock menu</div>,
}));

describe("Header", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
  });

  it("renders the home link and menu", () => {
    const { container } = render(<Header />);

    expect(
      screen.getByRole("link", { name: "Go to homepage" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByTestId("menu")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("hides while scrolling down and shows while scrolling up", () => {
    const { container } = render(<Header />);
    const header = container.firstElementChild;

    expect(header).toHaveClass("translate-y-0");

    window.scrollY = 100;
    fireEvent.scroll(window);
    expect(header).toHaveClass("-translate-y-full");

    window.scrollY = 50;
    fireEvent.scroll(window);
    expect(header).toHaveClass("translate-y-0");
  });

  it("shows at the top and ignores an unchanged scroll position", () => {
    const { container } = render(<Header />);
    const header = container.firstElementChild;

    window.scrollY = 100;
    fireEvent.scroll(window);
    fireEvent.scroll(window);
    expect(header).toHaveClass("-translate-y-full");

    window.scrollY = 0;
    fireEvent.scroll(window);
    expect(header).toHaveClass("translate-y-0");
  });

  it("uses the current scroll position as its initial baseline", () => {
    window.scrollY = 200;
    const { container } = render(<Header />);

    window.scrollY = 250;
    fireEvent.scroll(window);

    expect(container.firstElementChild).toHaveClass("-translate-y-full");
  });

  it("removes its scroll listener when unmounted", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Header />);
    const scrollListener = addEventListener.mock.calls.find(
      ([eventName]) => eventName === "scroll",
    )?.[1];

    unmount();

    expect(scrollListener).toBeDefined();
    expect(removeEventListener).toHaveBeenCalledWith("scroll", scrollListener);
  });
});
