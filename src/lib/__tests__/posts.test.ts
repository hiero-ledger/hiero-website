import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fsMocks = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock("node:fs", () => ({
  default: {
    existsSync: fsMocks.existsSync,
    readdirSync: fsMocks.readdirSync,
    readFileSync: fsMocks.readFileSync,
  },
  existsSync: fsMocks.existsSync,
  readdirSync: fsMocks.readdirSync,
  readFileSync: fsMocks.readFileSync,
}));

import {
  FALLBACK_IMAGE,
  getAllPosts,
  getBlogIndexMeta,
  getPostBySlug,
  getSimplePage,
  getSimplePageWithDefaults,
} from "../posts";

const postsDir = path.join(process.cwd(), "content", "posts");
const blogIndexFile = path.join(postsDir, "_index.md");

function postPath(filename: string): string {
  return path.join(postsDir, filename);
}

describe("posts", () => {
  beforeEach(() => {
    fsMocks.existsSync.mockReset();
    fsMocks.readdirSync.mockReset();
    fsMocks.readFileSync.mockReset();
  });

  describe("getAllPosts", () => {
    it("returns sorted published posts with normalized metadata", () => {
      fsMocks.existsSync.mockImplementation(
        (filePath: string) => filePath === postsDir,
      );
      fsMocks.readdirSync.mockReturnValue([
        "older.md",
        "_index.md",
        "draft.md",
        "newer.md",
        "broken.md",
      ]);
      fsMocks.readFileSync.mockImplementation((filePath: string) => {
        switch (filePath) {
          case postPath("older.md"):
            return `+++
title = "Older"
date = 2026-03-10
categories = ["Blog"]
tags = ["release"]

[[authors]]
name = "Alex"
title = "Maintainer"
+++
Older body
`;
          case postPath("draft.md"):
            return `+++
title = "Draft"
date = 2026-03-15
draft = true
+++
Draft body
`;
          case postPath("newer.md"):
            return `+++
title = "Newer"
date = "2026-03-20T00:00:00Z"
description = "Latest update"
featured_image = "/images/newer.png"
duration = "3 min read"
categories = ["News"]
tags = ["launch"]
slug = "custom-slug"
+++
Newer body
`;
          case postPath("broken.md"):
            return `+++
date = [
+++
Broken body
`;
          default:
            throw new Error(`Unexpected file: ${filePath}`);
        }
      });

      const posts = getAllPosts();

      expect(posts).toHaveLength(2);
      expect(posts[0]).toMatchObject({
        slug: "custom-slug",
        title: "Newer",
        date: "2026-03-20T00:00:00.000Z",
        abstract: "Latest update",
        featuredImage: "/images/newer.png",
        duration: "3 min read",
        categories: ["News"],
        tags: ["launch"],
      });
      expect(posts[1]).toMatchObject({
        slug: "older",
        title: "Older",
        date: "2026-03-10T00:00:00.000Z",
        featuredImage: FALLBACK_IMAGE,
        categories: ["Blog"],
        tags: ["release"],
        authors: [{ name: "Alex", title: "Maintainer" }],
      });
    });

    it("returns an empty list when the posts directory is missing", () => {
      fsMocks.existsSync.mockReturnValue(false);

      expect(getAllPosts()).toEqual([]);
      expect(fsMocks.readdirSync).not.toHaveBeenCalled();
    });
  });

  describe("getPostBySlug", () => {
    it("returns the matching post and strips legacy shortcodes from content", () => {
      fsMocks.existsSync.mockImplementation(
        (filePath: string) => filePath === postsDir,
      );
      fsMocks.readdirSync.mockReturnValue(["match.md", "other.md"]);
      fsMocks.readFileSync.mockImplementation((filePath: string) => {
        switch (filePath) {
          case postPath("match.md"):
            return `+++
title = "Matched"
date = 2026-03-22
slug = "target-post"
+++
Intro paragraph.

{{< note >}}

Body copy.

{{% cta %}}
`;
          case postPath("other.md"):
            return `+++
title = "Other"
date = 2026-03-01
+++
Other body
`;
          default:
            throw new Error(`Unexpected file: ${filePath}`);
        }
      });

      const post = getPostBySlug("target-post");

      expect(post).not.toBeNull();
      expect(post).toMatchObject({
        slug: "target-post",
        title: "Matched",
        date: "2026-03-22T00:00:00.000Z",
      });
      expect(post?.contentMarkdown).toContain("Intro paragraph.");
      expect(post?.contentMarkdown).toContain("Body copy.");
      expect(post?.contentMarkdown).not.toContain("{{<");
      expect(post?.contentMarkdown).not.toContain("{{%");
    });
  });

  describe("getBlogIndexMeta", () => {
    it("reads blog index metadata when the file exists", () => {
      fsMocks.existsSync.mockImplementation(
        (filePath: string) => filePath === blogIndexFile,
      );
      fsMocks.readFileSync.mockReturnValue(`+++
title = "Engineering Updates"
subtitle = "Latest news from the Hiero team"
list_title = "Recent Stories"
+++
`);

      expect(getBlogIndexMeta()).toEqual({
        title: "Engineering Updates",
        subtitle: "Latest news from the Hiero team",
        listTitle: "Recent Stories",
      });
    });

    it("falls back to default metadata when the blog index is missing", () => {
      fsMocks.existsSync.mockReturnValue(false);

      expect(getBlogIndexMeta()).toEqual({
        title: "Hiero Blog",
        subtitle: "Stay up to date with our latest news and announcements.",
        listTitle: "Recent Articles",
      });
    });
  });

  describe("simple pages", () => {
    it("parses a markdown-backed page and removes shortcode markup", () => {
      const contentPath = "content/pages/example.md";
      const fullPath = path.join(process.cwd(), contentPath);

      fsMocks.existsSync.mockImplementation(
        (filePath: string) => filePath === fullPath,
      );
      fsMocks.readFileSync.mockImplementation((filePath: string) => {
        if (filePath !== fullPath) {
          throw new Error(`Unexpected file: ${filePath}`);
        }

        return `---
title: Example Page
description: Example summary
---
Page intro.

{{< ignored >}}

More content.
`;
      });

      expect(getSimplePage(contentPath)).toEqual({
        title: "Example Page",
        description: "Example summary",
        contentMarkdown: "Page intro.\n\n\n\nMore content.",
      });
    });

    it("returns fallback values when a simple page is unavailable", () => {
      fsMocks.existsSync.mockReturnValue(false);

      expect(
        getSimplePageWithDefaults("content/pages/missing.md", {
          title: "Fallback title",
          description: "Fallback description",
        }),
      ).toEqual({
        title: "Fallback title",
        description: "Fallback description",
        contentMarkdown: "",
      });
    });
  });

  describe("slug generation", () => {
    it("uses frontmatter slug when provided", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["post.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "My Post"
slug = "explicit-slug"
date = 2026-01-01
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0].slug).toBe("explicit-slug");
    });

    it("derives slug from filename when no frontmatter slug is given", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["my-filename.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "My Post"
date = 2026-01-01
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0].slug).toBe("my-filename");
    });

    it("sanitizes filename-derived slug: lowercase, spaces to hyphens, removes special chars", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["My Cool Post! (2026).md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "My Cool Post! (2026)"
date = 2026-01-01
+++
Content`);

      const posts = getAllPosts();
      // Expect: lowercase, spaces → hyphens, remove punctuation except hyphens
      expect(posts[0].slug).toBe("my-cool-post-2026");
    });

    it("handles uppercase and mixed-case filenames", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["UPPERCASE_POST.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "Uppercase"
date = 2026-01-01
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0].slug).toBe("uppercase-post"); // or "uppercase-post" depending on impl
    });

    it("uses the slug for lookups in getPostBySlug", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["filename.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "Test"
slug = "custom-lookup"
date = 2026-01-01
+++
Content`);

      const post = getPostBySlug("custom-lookup");
      expect(post).not.toBeNull();
      expect(post?.slug).toBe("custom-lookup");
    });

    it("returns null when slug does not match any post (derived or explicit)", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["existing.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "Existing"
date = 2026-01-01
+++
Content`);

      const post = getPostBySlug("nonexistent");
      expect(post).toBeNull();
    });
  });

  describe("date parsing and sorting", () => {
    it("parses YYYY-MM-DD date strings correctly", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["post.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "Post"
date = 2025-12-25
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0].date).toBe("2025-12-25T00:00:00.000Z");
    });

    it("parses ISO 8601 date strings with time", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["post.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "Post"
date = "2026-03-20T15:30:00Z"
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0].date).toBe("2026-03-20T15:30:00.000Z");
    });

    it("handles missing date by falling back to a default (e.g., file mtime or epoch)", () => {
      // Implementation dependent; test that it doesn't crash and returns some date string.
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["nodate.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "No Date"
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0]).toHaveProperty("date");
      expect(typeof posts[0].date).toBe("string");
    });
    it("skips posts with invalid date formats (or treats as oldest)", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["valid.md", "invalid.md"]);
      fsMocks.readFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes("valid.md")) {
          return `+++\ntitle = "Valid"\ndate = 2026-01-01\n+++\nContent`;
        } else {
          return `+++\ntitle = "Invalid"\ndate = "not-a-date"\n+++\nContent`;
        }
      });

      const posts = getAllPosts();

      // Both posts are kept (length 2)
      expect(posts).toHaveLength(2);

      // At least one post has the correct valid date
      expect(posts.some(p => p.date === "2026-01-01T00:00:00.000Z")).toBe(true);

      // All posts have some date string (fallback for invalid)
      expect(posts.every(p => typeof p.date === "string")).toBe(true);
    });

    it("sorts posts in descending date order (newest first)", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["old.md", "new.md", "middle.md"]);
      fsMocks.readFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes("old.md"))
          return `+++\ntitle = "Old"\ndate = 2024-01-01\n+++`;
        if (filePath.includes("middle.md"))
          return `+++\ntitle = "Middle"\ndate = 2025-01-01\n+++`;
        return `+++\ntitle = "New"\ndate = 2026-01-01\n+++`;
      });

      const posts = getAllPosts();
      expect(posts.map(p => p.title)).toEqual(["New", "Middle", "Old"]);
    });

    it("handles equal dates by stable sort (e.g., by title or filename)", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["a.md", "b.md"]);
      fsMocks.readFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes("a.md"))
          return `+++\ntitle = "A"\ndate = 2026-01-01\n+++`;
        return `+++\ntitle = "B"\ndate = 2026-01-01\n+++`;
      });

      const posts = getAllPosts();

      expect(posts[0].title).toBe("A");
      expect(posts[1].title).toBe("B");
    });
  });
  describe("draft filtering", () => {
    it("excludes posts with draft = true from getAllPosts", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["published.md", "draft.md"]);
      fsMocks.readFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes("published.md")) {
          return `+++\ntitle = "Published"\ndate = 2026-01-01\ndraft = false\n+++`;
        }
        return `+++\ntitle = "Draft"\ndate = 2026-01-02\ndraft = true\n+++`;
      });

      const posts = getAllPosts();

      // Should only find the one published post
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe("Published");
    });

    it("strictly excludes draft posts from getPostBySlug lookup", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["draft.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "Draft Post"
slug = "draft-post"
date = 2026-01-01
draft = true
+++
Draft content`);

      const post = getPostBySlug("draft-post");

      // Because data.draft === true, the function hits 'continue' and returns null
      expect(post).toBeNull();
    });

    it("allows retrieving posts via getPostBySlug when draft is false", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["live-post.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "Live Post"
slug = "live-post"
date = 2026-01-01
draft = false
+++
Live content`);

      const post = getPostBySlug("live-post");

      expect(post).not.toBeNull();
      expect(post?.title).toBe("Live Post");
      expect(post?.slug).toBe("live-post");
    });
  });

  describe("metadata fallbacks and edge cases", () => {
    it("uses FALLBACK_IMAGE when featured_image is missing", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["no-image.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "No Image"
date = 2026-01-01
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0].featuredImage).toBe(FALLBACK_IMAGE);
    });

    it("keeps provided featured_image when present", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["with-image.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "With Image"
date = 2026-01-01
featured_image = "/custom.png"
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0].featuredImage).toBe("/custom.png");
    });

    it("handles missing description/abstract gracefully (undefined or empty)", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["no-desc.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "No Description"
date = 2026-01-01
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0].abstract).toBeUndefined();
    });

    it("handles missing categories and tags as empty arrays", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["no-tax.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "No Categories"
date = 2026-01-01
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0].categories).toEqual([]);
      expect(posts[0].tags).toEqual([]);
    });

    it("handles missing authors field", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["no-author.md"]);
      fsMocks.readFileSync.mockReturnValue(`+++
title = "No Author"
date = 2026-01-01
+++
Content`);

      const posts = getAllPosts();
      expect(posts[0].authors).toEqual([]);
    });

    it("skips malformed frontmatter files without crashing", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["good.md", "bad.md"]);
      fsMocks.readFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes("good.md")) {
          return `+++\ntitle = "Good"\ndate = 2026-01-01\n+++`;
        }
        return `+++\ntitle = "Bad"\ndate = [invalid]\n+++`;
      });

      const posts = getAllPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe("Good");
    });

    it("ignores non-markdown files in posts directory", () => {
      fsMocks.existsSync.mockReturnValue(true);
      fsMocks.readdirSync.mockReturnValue(["post.md", "image.png", "draft.md"]);
      fsMocks.readFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes(".md")) {
          return `+++\ntitle = "Markdown"\ndate = 2026-01-01\n+++`;
        }
        throw new Error("Should not read non-md files");
      });

      const posts = getAllPosts();
      expect(posts).toHaveLength(2); // both .md files
    });
  });
});
