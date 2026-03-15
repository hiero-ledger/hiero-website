import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RichText from "@/components/RichText";

describe("RichText", () => {
  it("renders markdown links and treats external links safely", () => {
    render(
      <RichText
        markdown={
          "[Internal](/blog/test-post) [External](https://example.com) [Email](mailto:test@example.com)"
        }
      />,
    );

    const internalLink = screen.getByRole("link", { name: "Internal" });
    const externalLink = screen.getByRole("link", { name: "External" });
    const emailLink = screen.getByRole("link", { name: "Email" });

    expect(internalLink).toHaveAttribute("href", "/blog/test-post");
    expect(internalLink).not.toHaveAttribute("target");

    expect(externalLink).toHaveAttribute("href", "https://example.com");
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noreferrer noopener");

    expect(emailLink).toHaveAttribute("href", "mailto:test@example.com");
    expect(emailLink).toHaveAttribute("target", "_blank");
  });

  it("skips raw html and supports inline rendering", () => {
    const { container } = render(
      <RichText
        as="span"
        inline
        markdown={'Safe [link](/safe) <a href="/evil">evil</a>'}
      />,
    );

    expect(screen.getByRole("link", { name: "link" })).toHaveAttribute(
      "href",
      "/safe",
    );
    expect(screen.queryByText("evil")).not.toBeInTheDocument();
    expect(container.querySelector("span > p")).toBeNull();
  });

  it("renders an empty wrapper when markdown is blank", () => {
    const { container } = render(
      <RichText as="p" className="content" markdown="   " />,
    );

    const paragraph = container.querySelector("p.content");
    expect(paragraph).not.toBeNull();
    expect(paragraph).toBeEmptyDOMElement();
  });

  it("renders link text without an anchor when href is missing", () => {
    render(<RichText markdown="[NoHref]()" />);

    expect(screen.getByText("NoHref")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "NoHref" })).toBeNull();
  });
});