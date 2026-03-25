import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "../not-found";

describe("not-found page", () => {
  it("renders the 404 content and recovery links", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { name: /This Page\s*Is Missing/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Visit Blog" })).toHaveAttribute(
      "href",
      "/blog",
    );
    expect(
      screen.getByRole("link", { name: "Join Community" }),
    ).toHaveAttribute("href", "/#meet");
  });
});
