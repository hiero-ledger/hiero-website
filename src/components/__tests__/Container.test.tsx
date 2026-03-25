import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Container from "../Container";

describe("Container", () => {
  it("renders its children with the base and custom classes", () => {
    render(<Container className="extra-space">Wrapped content</Container>);

    expect(screen.getByText("Wrapped content")).toHaveClass(
      "container",
      "extra-space",
    );
  });
});
