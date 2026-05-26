import path from "node:path";
import fc from "fast-check";
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
  getAllPosts,
  getBlogIndexMeta,
  getPostBySlug,
  getSimplePage,
} from "../posts";

const postsDir = path.join(process.cwd(), "content", "posts");
const blogIndexFile = path.join(postsDir, "_index.md");
const postFile = "fuzz-post.md";
const simpleContentPath = "content/fuzz-page.md";
const simpleFullPath = path.join(process.cwd(), simpleContentPath);
const fuzzRuns = 500;

// -- Arbitraries --

const fuzzDelimiter = fc.constantFrom("---", "+++", "~~~", "");
const fuzzHeading = fc
  .tuple(
    fc.integer({ min: 1, max: 6 }),
    fc.string({ unit: "binary", maxLength: 60 }),
  )
  .map(([level, text]) => `${"#".repeat(level)} ${text}`);
const fuzzCodeBlock = fc
  .tuple(
    fc.constantFrom("```", "~~~"),
    fc.constantFrom("", "js", "ts", "toml", "yaml"),
    fc.string({ unit: "binary", maxLength: 200 }),
  )
  .map(([fence, lang, code]) => `${fence}${lang}\n${code}\n${fence}`);
const fuzzShortcode = fc
  .tuple(
    fc.constantFrom("{{< ", "{{% "),
    fc.stringMatching(/^[a-z-]{1,20}$/),
    fc.string({ unit: "binary", maxLength: 80 }),
  )
  .map(([open, tag, inner]) => {
    const close = open === "{{< " ? " >}}" : " %}}";
    return `${open}${tag}${close}\n${inner}\n${open}/${tag}${close}`;
  });
const fuzzMarkdownSection = fc.oneof(
  fc.string({ unit: "binary", maxLength: 200 }),
  fuzzHeading,
  fuzzCodeBlock,
  fuzzShortcode,
);
const structuredMarkdownContent = fc
  .record({
    frontmatterDelim: fuzzDelimiter,
    frontmatterBody: fc.string({ unit: "binary", maxLength: 300 }),
    sections: fc.array(fuzzMarkdownSection, { minLength: 0, maxLength: 5 }),
  })
  .map(({ frontmatterDelim, frontmatterBody, sections }) => {
    const fm = frontmatterDelim
      ? `${frontmatterDelim}\n${frontmatterBody}\n${frontmatterDelim}\n`
      : "";
    return `${fm}${sections.join("\n\n")}`;
  });

const safeTomlText = fc.stringMatching(/^[ A-Za-z0-9.,:_/@#-]{0,80}$/);
const safeNonEmptyTomlText = fc.stringMatching(/^[ A-Za-z0-9.,:_/@#-]{1,80}$/);
const safeSlug = fc.stringMatching(/^[a-z0-9][a-z0-9-]{0,59}$/);
const bareDate = fc
  .record({
    year: fc.integer({ min: 2020, max: 2035 }),
    month: fc.integer({ min: 1, max: 12 }),
    day: fc.integer({ min: 1, max: 28 }),
  })
  .map(
    ({ year, month, day }) =>
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  );

function tomlString(value: string): string {
  return JSON.stringify(value);
}

describe("content parsing fuzz tests", () => {
  beforeEach(() => {
    fsMocks.existsSync.mockReset();
    fsMocks.readdirSync.mockReset();
    fsMocks.readFileSync.mockReset();
  });

  describe("getSimplePage", () => {
    it("handles structured markdown with frontmatter", () => {
      fc.assert(
        fc.property(structuredMarkdownContent, raw => {
          fsMocks.existsSync.mockImplementation(
            (p: string) => p === simpleFullPath,
          );
          fsMocks.readFileSync.mockReturnValue(raw);

          const page = getSimplePage(simpleContentPath);

          if (page === null) {
            return;
          }

          expect(page).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              description: expect.any(String),
              contentMarkdown: expect.any(String),
            }),
          );
        }),
        { numRuns: fuzzRuns, seed: 20260523 },
      );
    });

    it("preserves shape for valid YAML frontmatter", () => {
      fc.assert(
        fc.property(
          fc.record({
            title: safeTomlText,
            description: safeTomlText,
            body: fc.string({ unit: "binary", maxLength: 1000 }),
          }),
          ({ title, description, body }) => {
            fsMocks.existsSync.mockImplementation(
              (p: string) => p === simpleFullPath,
            );
            fsMocks.readFileSync.mockReturnValue(`---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
---
${body}`);

            const page = getSimplePage(simpleContentPath);

            expect(page).not.toBeNull();
            expect(page?.title).toBe(title);
            expect(page?.description).toBe(description);
            expect(typeof page?.contentMarkdown).toBe("string");
          },
        ),
        { numRuns: fuzzRuns, seed: 20260524 },
      );
    });
  });

  describe("getAllPosts", () => {
    it("handles structured markdown with TOML frontmatter", () => {
      fc.assert(
        fc.property(structuredMarkdownContent, raw => {
          fsMocks.existsSync.mockImplementation((p: string) => p === postsDir);
          fsMocks.readdirSync.mockReturnValue([postFile]);
          fsMocks.readFileSync.mockReturnValue(raw);

          const posts = getAllPosts();

          expect(Array.isArray(posts)).toBe(true);
          expect(posts.length).toBeLessThanOrEqual(1);

          for (const post of posts) {
            expect(post).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                title: expect.any(String),
                date: expect.any(String),
                featuredImage: expect.any(String),
                authors: expect.any(Array),
                categories: expect.any(Array),
                tags: expect.any(Array),
              }),
            );
            expect(post.date).toMatch(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
            );
            expect(post.slug).not.toMatch(/["'<>\\]/);
          }
        }),
        { numRuns: fuzzRuns, seed: 20260525 },
      );
    });

    it("fails safely for malformed TOML frontmatter", () => {
      fc.assert(
        fc.property(fc.string({ unit: "binary", maxLength: 1000 }), body => {
          fsMocks.existsSync.mockImplementation((p: string) => p === postsDir);
          fsMocks.readdirSync.mockReturnValue([postFile]);
          fsMocks.readFileSync.mockReturnValue(`+++\ndate = [\n+++\n${body}`);

          expect(getAllPosts()).toEqual([]);
        }),
        { numRuns: fuzzRuns, seed: 20260527 },
      );
    });

    it("gracefully handles arbitrary TOML frontmatter", () => {
      fc.assert(
        fc.property(fc.string({ unit: "binary", maxLength: 500 }), input => {
          fsMocks.existsSync.mockImplementation((p: string) => p === postsDir);
          fsMocks.readdirSync.mockReturnValue([postFile]);
          fsMocks.readFileSync.mockReturnValue(
            `+++\n${input}\n+++\nBody content`,
          );

          const posts = getAllPosts();

          expect(Array.isArray(posts)).toBe(true);
          expect(posts.length).toBeLessThanOrEqual(1);

          for (const post of posts) {
            expect(post).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                title: expect.any(String),
              }),
            );
          }
        }),
        { numRuns: fuzzRuns, seed: 20260528 },
      );
    });
  });

  describe("getPostBySlug", () => {
    it("preserves metadata shape for valid TOML frontmatter", () => {
      fc.assert(
        fc.property(
          fc.record({
            slug: safeSlug,
            title: safeTomlText,
            date: bareDate,
            abstract: safeNonEmptyTomlText,
            category: safeTomlText,
            tag: safeTomlText,
            authorName: safeNonEmptyTomlText,
            body: fc.string({ unit: "binary", maxLength: 1000 }),
          }),
          ({
            slug,
            title,
            date,
            abstract,
            category,
            tag,
            authorName,
            body,
          }) => {
            fsMocks.existsSync.mockImplementation(
              (p: string) => p === postsDir,
            );
            fsMocks.readdirSync.mockReturnValue([postFile]);
            fsMocks.readFileSync.mockReturnValue(`+++
title = ${tomlString(title)}
date = ${date}
slug = ${tomlString(slug)}
abstract = ${tomlString(abstract)}
featured_image = "/images/fuzz.png"
categories = [${tomlString(category)}]
tags = [${tomlString(tag)}]

[[authors]]
name = ${tomlString(authorName)}
+++
${body}`);

            const post = getPostBySlug(slug);

            expect(post).not.toBeNull();
            expect(post).toEqual(
              expect.objectContaining({
                slug,
                title,
                date: `${date}T00:00:00.000Z`,
                abstract,
                featuredImage: "/images/fuzz.png",
                authors: [expect.objectContaining({ name: authorName })],
                categories: [category],
                tags: [tag],
                contentMarkdown: expect.any(String),
              }),
            );
          },
        ),
        { numRuns: fuzzRuns, seed: 20260526 },
      );
    });

    it("returns null for malformed TOML frontmatter", () => {
      fc.assert(
        fc.property(fc.string({ unit: "binary", maxLength: 1000 }), body => {
          fsMocks.existsSync.mockImplementation((p: string) => p === postsDir);
          fsMocks.readdirSync.mockReturnValue([postFile]);
          fsMocks.readFileSync.mockReturnValue(`+++\ndate = [\n+++\n${body}`);

          expect(getPostBySlug("fuzz-post")).toBeNull();
        }),
        { numRuns: fuzzRuns, seed: 20260530 },
      );
    });
  });

  describe("getBlogIndexMeta", () => {
    it("handles structured content without crashing", () => {
      fc.assert(
        fc.property(structuredMarkdownContent, raw => {
          fsMocks.existsSync.mockImplementation(
            (p: string) => p === blogIndexFile,
          );
          fsMocks.readFileSync.mockReturnValue(raw);

          const meta = getBlogIndexMeta();

          expect(meta).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              subtitle: expect.any(String),
              listTitle: expect.any(String),
            }),
          );
        }),
        { numRuns: fuzzRuns, seed: 20260529 },
      );
    });
  });

  describe("slug sanitization", () => {
    it("never produces path traversal, scheme injection, or XSS characters", () => {
      fc.assert(
        fc.property(fc.string({ unit: "binary", maxLength: 200 }), input => {
          fsMocks.existsSync.mockImplementation((p: string) => p === postsDir);
          fsMocks.readdirSync.mockReturnValue([postFile]);
          fsMocks.readFileSync.mockReturnValue(
            `+++\ntitle = "T"\ndate = 2026-01-01\nslug = ${JSON.stringify(input)}\n+++\nBody`,
          );

          const posts = getAllPosts();

          for (const post of posts) {
            expect(post.slug).not.toMatch(/\.\.\//);
            expect(post.slug).not.toMatch(/^[.:]+/);
            expect(post.slug).not.toMatch(/["'<>\\]/);
            expect(post.slug).not.toMatch(/\/{2,}/);
            expect(post.slug).not.toMatch(/^\//);
            expect(post.slug).not.toMatch(/\/$/);
          }
        }),
        { numRuns: fuzzRuns, seed: 20260531 },
      );
    });
  });

  describe("shortcode stripping", () => {
    it("removes all Hugo shortcodes from post content", () => {
      fc.assert(
        fc.property(
          fc.record({
            tag: fc.stringMatching(/^[a-z-]{1,20}$/),
            inner: fc.string({ unit: "binary", maxLength: 100 }),
          }),
          ({ tag, inner }) => {
            const body = `Text before\n{{< ${tag} >}}\n${inner}\n{{< /${tag} >}}\nText after`;
            fsMocks.existsSync.mockImplementation(
              (p: string) => p === postsDir,
            );
            fsMocks.readdirSync.mockReturnValue([postFile]);
            fsMocks.readFileSync.mockReturnValue(
              `+++\ntitle = "T"\ndate = 2026-01-01\n+++\n${body}`,
            );

            const post = getPostBySlug("fuzz-post");

            expect(post).not.toBeNull();
            expect(post?.contentMarkdown).not.toMatch(/\{\{[<%]/);
          },
        ),
        { numRuns: fuzzRuns, seed: 20260532 },
      );
    });
  });

  describe("Windows line endings", () => {
    it("parses TOML frontmatter with CRLF line endings", () => {
      fc.assert(
        fc.property(
          fc.record({
            title: safeTomlText,
            date: bareDate,
            body: fc.string({ unit: "binary", maxLength: 500 }),
          }),
          ({ title, date, body }) => {
            const content = `+++\r\ntitle = ${tomlString(title)}\r\ndate = ${date}\r\n+++\r\n${body}`;
            fsMocks.existsSync.mockImplementation(
              (p: string) => p === postsDir,
            );
            fsMocks.readdirSync.mockReturnValue([postFile]);
            fsMocks.readFileSync.mockReturnValue(content);

            const posts = getAllPosts();

            expect(posts.length).toBe(1);
            expect(posts[0].title).toBe(title);
            expect(posts[0].date).toBe(`${date}T00:00:00.000Z`);
          },
        ),
        { numRuns: fuzzRuns, seed: 20260533 },
      );
    });
  });
});
