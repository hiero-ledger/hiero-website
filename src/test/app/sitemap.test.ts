import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/posts", () => ({
  getAllPosts: () => [
    {
      slug: "post-1",
      date: "2026-01-01T00:00:00Z",
      title: "Post",
      featuredImage: "/images/p1.png",
      authors: [],
      categories: [],
      tags: [],
    },
  ],
}));

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes static and dynamic routes", () => {
    const result = sitemap();

    const urls = result.map(entry => entry.url);

    expect(urls).toContain("https://hiero.org");
    expect(urls).toContain("https://hiero.org/blog");
    expect(urls).toContain("https://hiero.org/blog/post-1");
  });
});
