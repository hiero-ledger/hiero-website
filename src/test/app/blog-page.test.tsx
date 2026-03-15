import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/posts", () => ({
  getAllPosts: () => [
    {
      slug: "post-1",
      title: "Post 1",
      date: "2026-01-01T00:00:00Z",
      featuredImage: "/images/p1.png",
      authors: [],
      categories: [],
      tags: [],
    },
  ],
  getBlogIndexMeta: () => ({
    title: "Blog",
    subtitle: "Latest updates",
    listTitle: "Recent",
  }),
}));

vi.mock("@/components/BlogPostList", () => ({
  default: ({ listTitle }: { listTitle: string }) => <div>List: {listTitle}</div>,
}));

import BlogPage from "@/app/blog/page";

describe("Blog page", () => {
  it("renders blog metadata and list", () => {
    render(<BlogPage />);

    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByText("Latest updates")).toBeInTheDocument();
    expect(screen.getByText("List: Recent")).toBeInTheDocument();
  });
});
