import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostMeta } from "@/lib/posts";
import BlogPostList from "../BlogPostList";

const posts: PostMeta[] = [
  {
    slug: "post-one",
    title: "Post One",
    date: "2026-03-01T00:00:00.000Z",
    abstract: "First abstract",
    featuredImage: "/images/one.png",
    duration: "2 min read",
    authors: [],
    categories: [],
    tags: [],
  },
  {
    slug: "post-two",
    title: "Post Two",
    date: "2026-03-02T00:00:00.000Z",
    abstract: "Second abstract",
    featuredImage: "/images/two.png",
    duration: "3 min read",
    authors: [],
    categories: [],
    tags: [],
  },
  {
    slug: "post-three",
    title: "Post Three",
    date: "2026-03-03T00:00:00.000Z",
    abstract: "Third abstract",
    featuredImage: "/images/three.png",
    duration: "4 min read",
    authors: [],
    categories: [],
    tags: [],
  },
  {
    slug: "post-four",
    title: "Post Four",
    date: "2026-03-04T00:00:00.000Z",
    abstract: "Fourth abstract",
    featuredImage: "/images/four.png",
    duration: "5 min read",
    authors: [],
    categories: [],
    tags: [],
  },
];

describe("BlogPostList", () => {
  beforeEach(() => {
    vi.mocked(window.scrollTo).mockClear();
  });

  it("paginates blog posts and scrolls to the top when changing page", async () => {
    const user = userEvent.setup();

    render(<BlogPostList posts={posts} listTitle="Recent Articles" />);

    expect(
      screen.getByRole("heading", { name: "Recent Articles" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.queryByText("Post Four")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Next"));

    expect(screen.getByText("Post Four")).toBeInTheDocument();
    expect(screen.queryByText("Post One")).not.toBeInTheDocument();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
