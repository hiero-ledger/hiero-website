import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders copyright and policy link", () => {
    render(<Footer />);

    expect(screen.getByText(/Copyright/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "https://lfprojects.org" })).toHaveAttribute(
      "href",
      "https://lfprojects.org",
    );
  });
});
