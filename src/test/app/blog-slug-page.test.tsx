import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const notFoundMock = vi.fn();

vi.mock("next/navigation", () => ({
  notFound: () => {
    notFoundMock();
    throw new Error("NEXT_NOT_FOUND");
  },
}));

vi.mock("@/lib/posts", () => ({
  getAllPosts: () => [
    {
      slug: "post-1",
      title: "Post 1",
      date: "2026-02-01T00:00:00Z",
      abstract: "Summary",
      featuredImage: "/images/p1.png",
      duration: "3 min read",
      authors: [{ name: "Alice" }],
      categories: [],
      tags: [],
    },
  ],
  getPostBySlug: (slug: string) =>
    slug === "post-1"
      ? {
          slug: "post-1",
          title: "Post 1",
          date: "2026-02-01T00:00:00Z",
          abstract: "Summary",
          featuredImage: "/images/p1.png",
          duration: "3 min read",
          authors: [{ name: "Alice" }],
          categories: [],
          tags: [],
          contentMarkdown: "Body",
        }
      : null,
}));

import BlogPostPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/blog/[slug]/page";

describe("Blog slug page", () => {
  it("generates static params", () => {
    expect(generateStaticParams()).toEqual([{ slug: "post-1" }]);
  });

  it("generates metadata for existing post", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "post-1" }),
    });

    expect(metadata).toMatchObject({ title: "Post 1", description: "Summary" });
  });

  it("renders post page", async () => {
    const element = await BlogPostPage({
      params: Promise.resolve({ slug: "post-1" }),
    });
    render(element);

    expect(screen.getByRole("heading", { name: "Post 1" })).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("calls notFound when post is missing", async () => {
    await expect(
      BlogPostPage({
        params: Promise.resolve({ slug: "missing" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFoundMock).toHaveBeenCalled();
  });
});
