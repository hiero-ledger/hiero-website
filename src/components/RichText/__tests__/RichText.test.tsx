import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RichText from "..";

describe("RichText", () => {
  it("renders internal and external links correctly", () => {
    render(
      <RichText markdown="See the [docs](/docs) or [email us](mailto:team@example.com)." />,
    );

    const docsLink = screen.getByRole("link", { name: "docs" });
    const emailLink = screen.getByRole("link", { name: "email us" });

    expect(docsLink).toHaveAttribute("href", "/docs");
    expect(docsLink).not.toHaveAttribute("target");
    expect(emailLink).toHaveAttribute("href", "mailto:team@example.com");
    expect(emailLink).toHaveAttribute("target", "_blank");
  });

  it("renders an empty wrapper when markdown is blank", () => {
    const { container } = render(<RichText markdown="   " className="empty" />);

    expect(container.firstChild).toHaveClass("empty");
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
