import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/Menu", () => ({
  default: () => <div data-testid="menu-mock">Menu</div>,
}));

import Header from "@/components/Header";

describe("Header", () => {
  it("renders logo link and menu", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Go to homepage" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByTestId("menu-mock")).toBeInTheDocument();
  });
});
