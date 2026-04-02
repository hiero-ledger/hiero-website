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
});
