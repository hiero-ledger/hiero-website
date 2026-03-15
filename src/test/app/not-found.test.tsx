import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "@/app/not-found";

describe("NotFound page", () => {
  it("renders message and navigation links", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: /This Page/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Visit Blog" })).toHaveAttribute("href", "/blog");
  });
});
