import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostMeta } from "@/lib/posts";
import BlogPostList from "..";

/** Enough posts to fill the first page of 12 and put one on a second. */
const posts: PostMeta[] = Array.from({ length: 13 }, (_, i) => ({
  slug: `post-${i + 1}`,
  title: `Post ${i + 1}`,
  date: new Date(Date.UTC(2026, 2, 13 - i)).toISOString(),
  abstract: `Abstract ${i + 1}`,
  featuredImage: `/images/${i + 1}.png`,
  duration: "2 min read",
  authors: [],
  categories: [],
  tags: [],
}));

const first = posts[0];
const last = posts[posts.length - 1];

describe("BlogPostList", () => {
  beforeEach(() => {
    // The archive scrolls itself into view on a page change; jsdom has no
    // layout, so the method has to be provided before it is called.
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("paginates the archive and scrolls back to its first row", async () => {
    const user = userEvent.setup();

    render(<BlogPostList posts={posts} listTitle="Recent Articles" />);

    expect(
      screen.getByRole("heading", { name: "Recent Articles" }),
    ).toBeInTheDocument();
    expect(screen.getByText(first.title)).toBeInTheDocument();
    expect(screen.queryByText(last.title)).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Next"));

    expect(screen.getByText(last.title)).toBeInTheDocument();
    expect(screen.queryByText(first.title)).not.toBeInTheDocument();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: "start",
    });
  });

  it("reports how many posts the archive holds and which page is shown", () => {
    render(<BlogPostList posts={posts} listTitle="Recent Articles" />);

    expect(screen.getByText("13 posts")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("marks the current page and disables the steps that lead nowhere", async () => {
    const user = userEvent.setup();

    render(<BlogPostList posts={posts} listTitle="Recent Articles" />);

    expect(screen.getByLabelText("Page 1")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByLabelText("First")).toBeDisabled();
    expect(screen.getByLabelText("Previous")).toBeDisabled();
    expect(screen.getByLabelText("Next")).toBeEnabled();

    await user.click(screen.getByLabelText("Last"));

    expect(screen.getByLabelText("Page 2")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByLabelText("Next")).toBeDisabled();
    expect(screen.getByLabelText("Last")).toBeDisabled();
    expect(screen.getByLabelText("Previous")).toBeEnabled();
  });

  it("leaves out the pager when everything fits on one page", () => {
    render(
      <BlogPostList posts={posts.slice(0, 3)} listTitle="Recent Articles" />,
    );

    expect(
      screen.queryByRole("navigation", { name: "Archive pages" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/^Page \d+ of/)).not.toBeInTheDocument();
  });
});
