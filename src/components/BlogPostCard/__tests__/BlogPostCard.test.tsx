import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PostMeta } from "@/lib/posts";
import BlogPostCard from "..";

function makePost(overrides: Partial<PostMeta> = {}): PostMeta {
  return {
    slug: "a-post",
    title: "A Post",
    date: "2026-03-04T00:00:00.000Z",
    abstract: "What the post is about",
    featuredImage: "/images/a-post.png",
    duration: "4 min read",
    readingMinutes: 4,
    authors: [],
    categories: [],
    tags: [],
    ...overrides,
  };
}

describe("BlogPostCard", () => {
  it("links to the post and announces the title rather than the whole card", () => {
    render(<BlogPostCard post={makePost()} />);

    const link = screen.getByRole("link", { name: "A Post" });

    expect(link).toHaveAttribute("href", "/blog/a-post");
    expect(link).toContainElement(
      screen.getByRole("heading", { name: "A Post" }),
    );
  });

  it("shows the featured image, decoratively — the heading carries the name", () => {
    render(<BlogPostCard post={makePost()} />);

    const image = screen.getByRole("presentation", { hidden: true });

    expect(image).toHaveAttribute("src", "/images/a-post.png");
    expect(image).toHaveAttribute("alt", "");
  });

  it("dates the card in a machine-readable form as well as a human one", () => {
    render(<BlogPostCard post={makePost()} />);

    const date = screen.getByText("04 Mar 2026");

    expect(date.tagName).toBe("TIME");
    expect(date).toHaveAttribute("dateTime", "2026-03-04T00:00:00.000Z");
  });

  it("shows the abstract when the post has one", () => {
    render(<BlogPostCard post={makePost()} />);

    expect(screen.getByText("What the post is about")).toBeInTheDocument();
  });

  it("leaves the abstract out entirely when the post has none", () => {
    render(<BlogPostCard post={makePost({ abstract: undefined })} />);

    expect(
      document.querySelector(".blog-card-abstract"),
    ).not.toBeInTheDocument();
  });

  /* The action repeats on every card, so it is hidden from assistive tech —
     the link already announces itself, and "Read the post" nine times over
     tells a screen reader user nothing the title has not. */
  it("hides the decorative action row from assistive technology", () => {
    render(<BlogPostCard post={makePost()} />);

    const action = document.querySelector(".blog-card-action");

    expect(action).toHaveAttribute("aria-hidden", "true");
    expect(
      screen.queryByText("Read the post", { ignore: "[aria-hidden] *" }),
    ).not.toBeInTheDocument();
  });
});
