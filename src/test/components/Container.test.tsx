import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Container from "@/components/Container";

describe("Container", () => {
  it("renders children and merges classes", () => {
    const { container } = render(
      <Container className="extra-class">Hello content</Container>,
    );

    expect(screen.getByText("Hello content")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("container");
    expect(container.firstChild).toHaveClass("extra-class");
  });
});
