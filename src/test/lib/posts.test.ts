import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

let tempDir: string | null = null;
let cwdSpy: ReturnType<typeof vi.spyOn> | null = null;

function createTempSite(): string {
  tempDir = mkdtempSync(path.join(os.tmpdir(), "hiero-website-tests-"));
  cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tempDir);
  return tempDir;
}

function writeFile(relativePath: string, content: string) {
  if (!tempDir) {
    throw new Error("Test temp directory has not been created.");
  }

  const fullPath = path.join(tempDir, relativePath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
}

async function loadPostsModule() {
  vi.resetModules();
  return import("@/lib/posts");
}

function writePublishedPostsFixture() {
  writeFile(
    "content/posts/_index.md",
    `+++
title = "Engineering Blog"
subtitle = "Latest engineering updates"
list_title = "Recent Posts"
+++
`,
  );

  writeFile(
    "content/posts/older-post.md",
    `+++
title = "Older Post"
date = 2026-03-01
draft = false
featured_image = "/images/older.png"
abstract = "Older abstract"
[[authors]]
name = "Older Author"
+++

Older content.
`,
  );

  writeFile(
    "content/posts/new-post.md",
    `+++
title = "New Post"
date = 2026-03-15
draft = false
slug = "custom-new-post"
description = "Summary from description"
[[authors]]
name = "New Author"
+++

Hello from the post.
{{< contributorsGrid endpoint="https://example.com" >}}
`,
  );

  writeFile(
    "content/posts/draft-post.md",
    `+++
title = "Draft Post"
date = 2026-03-20
draft = true
+++

This should not appear.
`,
  );
}

afterEach(() => {
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true });
    tempDir = null;
  }

  cwdSpy?.mockRestore();
  cwdSpy = null;
  vi.doUnmock("gray-matter");
  vi.resetModules();
});

describe("posts helpers", () => {
  it("loads published blog posts, derives slugs, and strips shortcodes", async () => {
    createTempSite();
    writePublishedPostsFixture();

    const { FALLBACK_IMAGE, getAllPosts, getBlogIndexMeta, getPostBySlug } =
      await loadPostsModule();

    const posts = getAllPosts();
    expect(posts).toHaveLength(2);
    expect(posts.map(post => post.slug)).toEqual([
      "custom-new-post",
      "older-post",
    ]);
    expect(posts[0]?.abstract).toBe("Summary from description");
    expect(posts[0]?.featuredImage).toBe(FALLBACK_IMAGE);

    const post = getPostBySlug("custom-new-post");
    expect(post?.title).toBe("New Post");
    expect(post?.contentMarkdown).toContain("Hello from the post.");
    expect(post?.contentMarkdown).not.toContain("contributorsGrid");

    const blogMeta = getBlogIndexMeta();
    expect(blogMeta).toEqual({
      title: "Engineering Blog",
      subtitle: "Latest engineering updates",
      listTitle: "Recent Posts",
    });
  });

  it("returns simple page content with defaults when a file is missing", async () => {
    createTempSite();

    writeFile(
      "content/heroes/index.md",
      `---
title: Heroes
description: Meet our contributors
---
Welcome to the heroes page.
{{% issueList endpoint="https://example.com" %}}
`,
    );

    const { getSimplePage, getSimplePageWithDefaults } =
      await loadPostsModule();

    const page = getSimplePage("content/heroes/index.md");
    expect(page).toEqual({
      title: "Heroes",
      description: "Meet our contributors",
      contentMarkdown: "Welcome to the heroes page.",
    });

    const fallbackPage = getSimplePageWithDefaults("content/missing/index.md", {
      title: "Fallback Title",
      description: "Fallback Description",
    });

    expect(fallbackPage).toEqual({
      title: "Fallback Title",
      description: "Fallback Description",
      contentMarkdown: "",
    });
  });

  it("covers fallback branches for dates, slug lookup, and parse errors", async () => {
    createTempSite();

    writeFile(
      "content/posts/_index.md",
      `+++
title = "Broken index"
invalid =
+++
`,
    );

    writeFile(
      "content/posts/no-date.md",
      `+++
title = "No Date Post"
draft = false
+++

Post content.
`,
    );

    writeFile(
      "content/heroes/broken.md",
      `---
title: Broken
: invalid
---
Body.
`,
    );

    const { getAllPosts, getBlogIndexMeta, getPostBySlug, getSimplePage } =
      await loadPostsModule();

    const posts = getAllPosts();
    expect(posts).toHaveLength(1);
    const noDatePost = posts.find(post => post.slug === "no-date");
    expect(noDatePost?.date).toBe(new Date(0).toISOString());

    expect(getPostBySlug("missing-slug")).toBeNull();

    expect(getBlogIndexMeta()).toEqual({
      title: "Hiero Blog",
      subtitle: "Stay up to date with our latest news and announcements.",
      listTitle: "Recent Articles",
    });

    expect(getSimplePage("content/heroes/broken.md")).toBeNull();
  });

  it("normalizes Date objects produced by frontmatter parsing", async () => {
    createTempSite();

    writeFile("content/posts/date-object.md", "Placeholder content");

    vi.doMock("gray-matter", () => ({
      default: () => ({
        data: {
          title: "Date Object Post",
          draft: false,
          date: new Date("2026-04-01T10:00:00Z"),
        },
        content: "Body",
      }),
    }));

    const { getAllPosts } = await loadPostsModule();
    const posts = getAllPosts();

    expect(posts).toHaveLength(1);
    expect(posts[0]?.date).toBe(new Date("2026-04-01T10:00:00Z").toISOString());
  });

  it("normalizes string dates produced by frontmatter parsing", async () => {
    createTempSite();

    writeFile("content/posts/string-date.md", "Placeholder content");

    const mockedMatter = vi.fn(() => ({
      data: {
        title: "String Date Post",
        draft: false,
        date: "2026-05-01T00:00:00.000Z",
      },
      content: "Body",
    }));

    vi.doMock("gray-matter", () => ({
      default: mockedMatter,
    }));

    const { getAllPosts } = await loadPostsModule();
    const posts = getAllPosts();

    expect(mockedMatter).toHaveBeenCalled();
    expect(posts).toHaveLength(1);
    expect(posts[0]?.date).toBe(new Date("2026-05-01T00:00:00.000Z").toISOString());
  });

  it("maps optional metadata fields and title fallback values", async () => {
    createTempSite();

    writeFile(
      "content/posts/rich-meta.md",
      `+++
title = "Rich Metadata"
date = 2026-02-01
duration = "5 min read"
categories = ["Engineering", "Releases"]
tags = ["sdk", "java"]
[[authors]]
name = "Alice"
title = "Engineer"
organization = "Hiero"
link = "https://example.com/alice"
image = "/images/alice.png"
+++

Metadata content.
`,
    );

    writeFile(
      "content/posts/no-title.md",
      `+++
date = 2026-02-02
draft = false
+++

Untitled content.
`,
    );

    const { getAllPosts } = await loadPostsModule();
    const posts = getAllPosts();

    const richMeta = posts.find(post => post.slug === "rich-meta");
    const untitled = posts.find(post => post.slug === "no-title");

    expect(richMeta?.duration).toBe("5 min read");
    expect(richMeta?.categories).toEqual(["Engineering", "Releases"]);
    expect(richMeta?.tags).toEqual(["sdk", "java"]);
    expect(richMeta?.authors).toEqual([
      {
        name: "Alice",
        title: "Engineer",
        organization: "Hiero",
        link: "https://example.com/alice",
        image: "/images/alice.png",
      },
    ]);
    expect(untitled?.title).toBe("");
  });

  it("handles missing directories and partial index/page frontmatter", async () => {
    createTempSite();

    const {
      getAllPosts,
      getBlogIndexMeta,
      getPostBySlug,
      getSimplePage,
      getSimplePageWithDefaults,
    } = await loadPostsModule();

    expect(getAllPosts()).toEqual([]);
    expect(getPostBySlug("missing")).toBeNull();

    writeFile(
      "content/posts/_index.md",
      `+++
title = "Only Title"
invalid =
+++
`,
    );

    expect(getBlogIndexMeta()).toEqual({
      title: "Hiero Blog",
      subtitle: "Stay up to date with our latest news and announcements.",
      listTitle: "Recent Articles",
    });

    writeFile("content/empty/index.md", "Body only with no frontmatter.");
    expect(getSimplePage("content/empty/index.md")).toBeNull();

    expect(
      getSimplePageWithDefaults("content/empty/index.md", {
        title: "Fallback",
        description: "Fallback description",
      }),
    ).toEqual({
      title: "Fallback",
      description: "Fallback description",
      contentMarkdown: "",
    });
  });

  it("uses defaults for missing blog index fields", async () => {
    createTempSite();

    writeFile("content/posts/_index.md", "placeholder");

    vi.doMock("gray-matter", () => ({
      default: () => ({
        data: {
          title: "Only Title",
        },
      }),
    }));

    const { getBlogIndexMeta } = await loadPostsModule();

    expect(getBlogIndexMeta()).toEqual({
      title: "Only Title",
      subtitle: "Stay up to date with our latest news and announcements.",
      listTitle: "Recent Articles",
    });
  });

  it("returns empty title and description when simple page frontmatter omits them", async () => {
    createTempSite();

    writeFile("content/empty/index.md", "placeholder");

    vi.doMock("gray-matter", () => ({
      default: () => ({
        data: {},
        content: "Body from parser",
      }),
    }));

    const { getSimplePage } = await loadPostsModule();

    expect(getSimplePage("content/empty/index.md")).toEqual({
      title: "",
      description: "",
      contentMarkdown: "Body from parser",
    });
  });

  it("maps author entries with missing optional fields to undefined", async () => {
    createTempSite();

    writeFile("content/posts/author-gaps.md", "placeholder");

    vi.doMock("gray-matter", () => ({
      default: () => ({
        data: {
          title: "Author Gaps",
          draft: false,
          date: "2026-03-05T00:00:00.000Z",
          authors: [{}],
        },
        content: "Author fallback content.",
      }),
    }));

    const { getAllPosts } = await loadPostsModule();
    const posts = getAllPosts();
    const authorGaps = posts.find(post => post.slug === "author-gaps");

    expect(authorGaps?.authors).toEqual([
      {
        name: undefined,
        title: undefined,
        organization: undefined,
        link: undefined,
        image: undefined,
      },
    ]);
  });
});
