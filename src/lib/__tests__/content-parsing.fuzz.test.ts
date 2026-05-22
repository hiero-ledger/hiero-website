import path from "node:path";
import fc from "fast-check";
import { parse as parseToml } from "toml";
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

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const BLOG_INDEX_FILE = path.join(POSTS_DIR, "_index.md");
const POST_FILE = "fuzz-post.md";
const POST_PATH = path.join(POSTS_DIR, POST_FILE);
const SIMPLE_CONTENT_PATH = "content/fuzz-page.md";
const SIMPLE_FULL_PATH = path.join(process.cwd(), SIMPLE_CONTENT_PATH);
const FUZZ_RUNS = 500;

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

function resetFsMocks(): void {
  fsMocks.existsSync.mockReset();
  fsMocks.readdirSync.mockReset();
  fsMocks.readFileSync.mockReset();
}

function mockSimplePage(raw: string): void {
  resetFsMocks();
  fsMocks.existsSync.mockImplementation(
    (filePath: string) => filePath === SIMPLE_FULL_PATH,
  );
  fsMocks.readFileSync.mockImplementation((filePath: string) => {
    if (filePath !== SIMPLE_FULL_PATH) {
      throw new Error(`Unexpected file: ${filePath}`);
    }

    return raw;
  });
}

function mockPost(raw: string): void {
  resetFsMocks();
  fsMocks.existsSync.mockImplementation(
    (filePath: string) => filePath === POSTS_DIR,
  );
  fsMocks.readdirSync.mockReturnValue([POST_FILE]);
  fsMocks.readFileSync.mockImplementation((filePath: string) => {
    if (filePath !== POST_PATH) {
      throw new Error(`Unexpected file: ${filePath}`);
    }

    return raw;
  });
}

function mockBlogIndex(raw: string): void {
  resetFsMocks();
  fsMocks.existsSync.mockImplementation(
    (filePath: string) => filePath === BLOG_INDEX_FILE,
  );
  fsMocks.readFileSync.mockImplementation((filePath: string) => {
    if (filePath !== BLOG_INDEX_FILE) {
      throw new Error(`Unexpected file: ${filePath}`);
    }

    return raw;
  });
}

function tomlString(value: string): string {
  return JSON.stringify(value);
}

describe("content parsing fuzz tests", () => {
  beforeEach(() => {
    resetFsMocks();
  });

  it("fuzzes arbitrary markdown and YAML frontmatter through simple page parsing", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 1500 }), raw => {
        mockSimplePage(raw);

        const page = getSimplePage(SIMPLE_CONTENT_PATH);

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
      {
        numRuns: FUZZ_RUNS,
        seed: 20260523,
      },
    );
  });

  it("preserves simple page shape for valid YAML frontmatter", () => {
    fc.assert(
      fc.property(
        fc.record({
          title: safeTomlText,
          description: safeTomlText,
          body: fc.string({ maxLength: 1000 }),
        }),
        ({ title, description, body }) => {
          mockSimplePage(`---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
---
${body}`);

          const page = getSimplePage(SIMPLE_CONTENT_PATH);

          expect(page).not.toBeNull();
          expect(page?.title).toBe(title);
          expect(page?.description).toBe(description);
          expect(typeof page?.contentMarkdown).toBe("string");
        },
      ),
      {
        numRuns: FUZZ_RUNS,
        seed: 20260524,
      },
    );
  });

  it("fuzzes arbitrary markdown and TOML frontmatter through blog post listing", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 1500 }), raw => {
        mockPost(raw);

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
          expect(Number.isNaN(Date.parse(post.date))).toBe(false);
          expect(post.slug).not.toMatch(/["'<>\\]/);
        }
      }),
      {
        numRuns: FUZZ_RUNS,
        seed: 20260525,
      },
    );
  });

  it("preserves blog post metadata shape for valid TOML frontmatter", () => {
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
          body: fc.string({ maxLength: 1000 }),
        }),
        ({ slug, title, date, abstract, category, tag, authorName, body }) => {
          mockPost(`+++
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
      {
        numRuns: FUZZ_RUNS,
        seed: 20260526,
      },
    );
  });

  it("fails safely for malformed TOML frontmatter in blog posts", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 1000 }), body => {
        mockPost(`+++
date = [
+++
${body}`);

        expect(getAllPosts()).toEqual([]);
        expect(getPostBySlug("fuzz-post")).toBeNull();
      }),
      {
        numRuns: FUZZ_RUNS,
        seed: 20260527,
      },
    );
  });

  it("reports arbitrary TOML parser failures as Error instances", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 500 }), input => {
        try {
          const parsed = parseToml(input.endsWith("\n") ? input : `${input}\n`);

          expect(parsed).toBeDefined();
          expect(typeof parsed).toBe("object");
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      }),
      {
        numRuns: FUZZ_RUNS,
        seed: 20260528,
      },
    );
  });

  it("fuzzes arbitrary TOML frontmatter through blog index metadata parsing", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 1000 }), raw => {
        mockBlogIndex(raw);

        const meta = getBlogIndexMeta();

        expect(meta).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            subtitle: expect.any(String),
            listTitle: expect.any(String),
          }),
        );
      }),
      {
        numRuns: FUZZ_RUNS,
        seed: 20260529,
      },
    );
  });
});
