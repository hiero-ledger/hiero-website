import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "..";

describe("Footer", () => {
  it("renders the footer copy and policy link", () => {
    const { container } = render(<Footer />);

    expect(screen.getByText(/Copyright/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "https://lfprojects.org" }),
    ).toHaveAttribute("href", "https://lfprojects.org");
    expect(container.firstChild).toMatchSnapshot();
  });
});
