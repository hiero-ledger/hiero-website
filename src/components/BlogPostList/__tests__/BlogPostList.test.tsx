import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostMeta } from "@/lib/posts";
import BlogPostList from "..";

function makePosts(count: number): PostMeta[] {
  return Array.from({ length: count }, (_, i) => ({
    slug: `post-${i + 1}`,
    title: `Post ${i + 1}`,
    date: new Date(Date.UTC(2026, 2, count - i)).toISOString(),
    abstract: `Abstract ${i + 1}`,
    featuredImage: `/images/${i + 1}.png`,
    duration: "2 min read",
    authors: [],
    categories: [],
    tags: [],
  }));
}

/** Four posts over pages of three: three on the first, the last on its own. */
const posts = makePosts(4);
const first = posts[0];
const last = posts[posts.length - 1];

describe("BlogPostList", () => {
  beforeEach(() => {
    // The archive scrolls itself into view on a page change; jsdom has no
    // layout, so the method has to be provided before it is called.
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("shows one page of three and paginates to the rest", async () => {
    const user = userEvent.setup();

    render(<BlogPostList posts={posts} listTitle="Recent Articles" />);

    expect(
      screen.getByRole("heading", { name: "Recent Articles" }),
    ).toBeInTheDocument();
    // One card per post, each titled by its own heading.
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getByText(first.title)).toBeInTheDocument();
    expect(screen.queryByText(last.title)).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Next"));

    expect(screen.getByText(last.title)).toBeInTheDocument();
    expect(screen.queryByText(first.title)).not.toBeInTheDocument();
  });

  it("scrolls back to the top of the archive on a page change", async () => {
    const user = userEvent.setup();

    render(<BlogPostList posts={posts} listTitle="Recent Articles" />);

    await user.click(screen.getByLabelText("Next"));

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: "start",
    });
  });

  it("reports how many posts the archive holds and which page is shown", () => {
    render(<BlogPostList posts={makePosts(13)} listTitle="Recent Articles" />);

    expect(screen.getByText("13 posts")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
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

  /* At three per page the pager window matters: a long archive has far more
     pages than the five numbers it can show at once. */
  it("keeps the page window around the current page in a long archive", async () => {
    const user = userEvent.setup();

    render(<BlogPostList posts={makePosts(60)} listTitle="Recent Articles" />);

    expect(screen.getByText("Page 1 of 20")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 5")).toBeInTheDocument();
    expect(screen.queryByLabelText("Page 6")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Last"));

    expect(screen.getByText("Page 20 of 20")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 16")).toBeInTheDocument();
    expect(screen.queryByLabelText("Page 15")).not.toBeInTheDocument();
  });

  it("leaves out the pager when everything fits on one page", () => {
    render(<BlogPostList posts={makePosts(3)} listTitle="Recent Articles" />);

    expect(
      screen.queryByRole("navigation", { name: "Archive pages" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/^Page \d+ of/)).not.toBeInTheDocument();
  });
});
