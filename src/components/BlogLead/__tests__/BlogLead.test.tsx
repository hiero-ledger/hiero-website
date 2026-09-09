import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PostMeta } from "@/lib/posts";
import BlogLead from "..";

function makePost(overrides: Partial<PostMeta> = {}): PostMeta {
  return {
    slug: "newest-post",
    title: "Newest Post",
    date: "2026-08-25T00:00:00.000Z",
    abstract: "The most recent thing that happened",
    featuredImage: "/images/newest.png",
    duration: "3 min read",
    readingMinutes: 3,
    authors: [{ name: "Hiero Team" }],
    categories: [],
    tags: [],
    ...overrides,
  };
}

describe("BlogLead", () => {
  it("links to the post and announces the title rather than the whole block", () => {
    render(<BlogLead post={makePost()} />);

    const link = screen.getByRole("link", { name: "Newest Post" });

    expect(link).toHaveAttribute("href", "/blog/newest-post");
    expect(link).toContainElement(
      screen.getByRole("heading", { name: "Newest Post" }),
    );
  });

  it("shows the featured image, decoratively — the heading carries the name", () => {
    render(<BlogLead post={makePost()} />);

    const image = screen.getByRole("presentation", { hidden: true });

    expect(image).toHaveAttribute("src", "/images/newest.png");
    expect(image).toHaveAttribute("alt", "");
  });

  it("bylines the post with its date and authors", () => {
    render(<BlogLead post={makePost()} />);

    const date = screen.getByText("25 August 2026");

    expect(date.tagName).toBe("TIME");
    expect(date).toHaveAttribute("dateTime", "2026-08-25T00:00:00.000Z");
    expect(screen.getByText("Hiero Team")).toBeInTheDocument();
  });

  it("joins multiple authors and drops the ones with no name", () => {
    render(
      <BlogLead
        post={makePost({
          authors: [
            { name: "Ada" },
            { organization: "No Name" },
            { name: "Linus" },
          ],
        })}
      />,
    );

    expect(screen.getByText("Ada, Linus")).toBeInTheDocument();
  });

  it("omits the byline author entirely when no author is named", () => {
    render(<BlogLead post={makePost({ authors: [] })} />);

    expect(screen.getByText("25 August 2026")).toBeInTheDocument();
    expect(
      document.querySelector(".blog-lead-byline-author"),
    ).not.toBeInTheDocument();
  });

  it("names the section by its own heading", () => {
    render(<BlogLead post={makePost()} />);

    expect(
      screen.getByRole("region", { name: "Newest Post" }),
    ).toBeInTheDocument();
  });
});
