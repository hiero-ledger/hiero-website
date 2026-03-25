import { afterEach, describe, expect, it, vi } from "vitest";

const postsMock = vi.hoisted(() => ({
  getAllPosts: vi.fn(),
}));

vi.mock("../../lib/posts", () => ({
  getAllPosts: postsMock.getAllPosts,
}));

describe("sitemap", () => {
  afterEach(() => {
    postsMock.getAllPosts.mockReset();
    delete process.env.NEXT_PUBLIC_SITE_URL;
    vi.resetModules();
  });

  it("returns static routes and blog post routes using the configured base url", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.org";
    postsMock.getAllPosts.mockReturnValue([
      {
        slug: "hello-world",
        title: "Hello World",
        date: "2026-03-20T00:00:00.000Z",
        featuredImage: "/images/hello.png",
        authors: [],
        categories: [],
        tags: [],
      },
    ]);

    const sitemapModule = await import("../sitemap");
    const entries = sitemapModule.default();

    expect(sitemapModule.dynamic).toBe("force-static");
    expect(postsMock.getAllPosts).toHaveBeenCalled();
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://example.org",
          changeFrequency: "weekly",
          priority: 1,
        }),
        expect.objectContaining({
          url: "https://example.org/blog",
          changeFrequency: "daily",
          priority: 0.8,
        }),
        expect.objectContaining({
          url: "https://example.org/blog/hello-world",
          changeFrequency: "monthly",
          priority: 0.6,
          lastModified: new Date("2026-03-20T00:00:00.000Z"),
        }),
      ]),
    );
  });
});
