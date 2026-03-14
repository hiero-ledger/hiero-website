"use client";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostMeta } from "@/lib/posts";
import BlogPostList from "@/components/BlogPostList";

function createPost(index: number): PostMeta {
  return {
    slug: `post-${index}`,
    title: `Post ${index}`,
    date: `2026-03-${String(index).padStart(2, "0")}T12:00:00Z`,
    abstract: index === 4 ? "x".repeat(401) : `Summary for post ${index}`,
    featuredImage: `/images/post-${index}.png`,
    duration: `${index} min read`,
    authors: [],
    categories: ["Blog"],
    tags: [`tag-${index}`],
  };
}

describe("BlogPostList", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollTo", {
      value: vi.fn(),
      writable: true,
    });
  });

  it("renders the first page and paginates to the next page", async () => {
    const user = userEvent.setup();
    const posts = [createPost(1), createPost(2), createPost(3), createPost(4)];

    render(<BlogPostList posts={posts} listTitle="Recent Articles" />);

    expect(screen.getByText("Recent Articles")).toBeInTheDocument();
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
    expect(screen.getByText("Post 3")).toBeInTheDocument();
    expect(screen.queryByText("Post 4")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Next"));

    expect(screen.getByText("Post 4")).toBeInTheDocument();
    expect(screen.queryByText("Post 1")).not.toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("truncates long abstracts with an ellipsis", () => {
    render(
      <BlogPostList posts={[createPost(4)]} listTitle="Recent Articles" />,
    );

    const expectedAbstract = `${"x".repeat(400)}…`;
    expect(screen.getByText(expectedAbstract)).toBeInTheDocument();
  });

  it("handles pagination guard paths and page-number navigation", async () => {
    const user = userEvent.setup();
    const posts = [
      createPost(1),
      createPost(2),
      createPost(3),
      createPost(4),
      createPost(5),
      createPost(6),
      createPost(7),
    ];

    render(<BlogPostList posts={posts} listTitle="Recent Articles" />);

    await user.click(screen.getByLabelText("First"));
    await user.click(screen.getByLabelText("Previous"));
    expect(window.scrollTo).not.toHaveBeenCalled();

    await user.click(screen.getByLabelText("Page 2"));
    expect(screen.getByText("Post 4")).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    await user.click(screen.getByLabelText("Previous"));
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledTimes(2);

    await user.click(screen.getByLabelText("Page 2"));
    await user.click(screen.getByLabelText("First"));
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledTimes(4);

    await user.click(screen.getByLabelText("Last"));
    expect(screen.getByText("Post 7")).toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledTimes(5);

    await user.click(screen.getByLabelText("Next"));
    await user.click(screen.getByLabelText("Last"));
    expect(window.scrollTo).toHaveBeenCalledTimes(5);
  });

  it("renders items without abstract text when abstract is undefined", () => {
    const postWithoutAbstract: PostMeta = {
      ...createPost(1),
      abstract: undefined,
    };

    render(
      <BlogPostList posts={[postWithoutAbstract]} listTitle="Recent Articles" />,
    );

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.queryByText("Summary for post 1")).not.toBeInTheDocument();
  });
});