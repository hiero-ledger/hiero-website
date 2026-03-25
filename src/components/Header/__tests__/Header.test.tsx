import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Header from "../Header";

vi.mock("@/components/Menu", () => ({
  default: () => <div data-testid="menu">Mock menu</div>,
}));

describe("Header", () => {
  it("renders the home link and menu", () => {
    const { container } = render(<Header />);

    expect(
      screen.getByRole("link", { name: "Go to homepage" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByTestId("menu")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
