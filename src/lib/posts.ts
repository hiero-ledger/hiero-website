import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { parse as parseToml } from "toml";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const BLOG_INDEX_FILE = path.join(POSTS_DIR, "_index.md");
export const FALLBACK_IMAGE = "/images/HI60000_GetInvolvedBanner_V1.jpg";

export interface PostAuthor {
  name?: string;
  title?: string;
  organization?: string;
  link?: string;
  image?: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  abstract?: string;
  featuredImage: string;
  duration?: string;
  authors: PostAuthor[];
  categories: string[];
  tags: string[];
}

export interface PostFull extends PostMeta {
  contentHtml: string;
}

export interface BlogIndexMeta {
  title: string;
  subtitle: string;
  listTitle: string;
}

function safeParseToml(input: string): object {
  let s = input.replace(/\r/g, "");
  // Convert bare dates (TOML 1.0 local dates) to datetime for TOML 0.4 compat
  s = s.replace(/^(\s*\w+\s*=\s*)(\d{4}-\d{2}-\d{2})\s*$/gm, "$1$2T00:00:00Z");
  if (!s.endsWith("\n")) s += "\n";
  return parseToml(s);
}

const MATTER_OPTIONS = {
  language: "toml" as const,
  delimiters: "+++" as const,
  engines: {
    toml: safeParseToml,
  },
};

function parseDate(raw: unknown): string {
  if (!raw) return new Date(0).toISOString();
  if (raw instanceof Date) return raw.toISOString();
  return new Date(String(raw)).toISOString();
}

function deriveSlug(data: Record<string, unknown>, filename: string): string {
  if (typeof data.slug === "string" && data.slug.trim()) return data.slug.trim();
  return filename.replace(/\.md$/, "");
}

function buildMeta(data: Record<string, unknown>, filename: string): PostMeta {
  return {
    slug: deriveSlug(data, filename),
    title: String(data.title ?? ""),
    date: parseDate(data.date),
    abstract: data.abstract ? String(data.abstract) : data.description ? String(data.description) : undefined,
    featuredImage: data.featured_image ? String(data.featured_image) : FALLBACK_IMAGE,
    duration: data.duration ? String(data.duration) : undefined,
    authors: Array.isArray(data.authors)
      ? data.authors.map((a: Record<string, unknown>) => ({
          name: a.name ? String(a.name) : undefined,
          title: a.title ? String(a.title) : undefined,
          organization: a.organization ? String(a.organization) : undefined,
          link: a.link ? String(a.link) : undefined,
          image: a.image ? String(a.image) : undefined,
        }))
      : [],
    categories: Array.isArray(data.categories) ? data.categories.map(String) : [],
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") && f !== "_index.md");
  const posts: PostMeta[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data } = matter(raw, MATTER_OPTIONS) as unknown as { data: Record<string, unknown> };
      if (data.draft === true) continue;
      posts.push(buildMeta(data, file));
    } catch { /* skip */ }
  }
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  if (!fs.existsSync(POSTS_DIR)) return null;
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") && f !== "_index.md");
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw, MATTER_OPTIONS) as unknown as { data: Record<string, unknown>; content: string };
      if (data.draft === true) continue;
      if (deriveSlug(data, file) !== slug) continue;
      const cleaned = content.replace(/\{\{<[^>]*>\}\}/g, "").replace(/\{\{%[^%]*%\}\}/g, "").trim();
      const processed = await remark().use(remarkHtml, { sanitize: false }).process(cleaned);
      return { ...buildMeta(data, file), contentHtml: processed.toString() };
    } catch { /* skip */ }
  }
  return null;
}

export function getBlogIndexMeta(): BlogIndexMeta {
  const fallback: BlogIndexMeta = { title: "Hiero Blog", subtitle: "Stay up to date with our latest news and announcements.", listTitle: "Recent Articles" };
  if (!fs.existsSync(BLOG_INDEX_FILE)) return fallback;
  try {
    const raw = fs.readFileSync(BLOG_INDEX_FILE, "utf8");
    const { data } = matter(raw, MATTER_OPTIONS) as unknown as { data: Record<string, unknown> };
    return {
      title: String(data.title ?? fallback.title),
      subtitle: String(data.subtitle ?? fallback.subtitle),
      listTitle: String(data.list_title ?? fallback.listTitle),
    };
  } catch { return fallback; }
}

/** Parse a simple content markdown file (e.g. hacktoberfest, heroes). */
export async function getSimplePage(contentPath: string): Promise<{ title: string; description: string; contentHtml: string } | null> {
  const filePath = path.join(process.cwd(), contentPath);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const cleaned = content.replace(/\{\{<[^>]*>\}\}/g, "").replace(/\{\{%[^%]*%\}\}/g, "").trim();
    const processed = await remark().use(remarkHtml, { sanitize: false }).process(cleaned);
    return {
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      contentHtml: processed.toString(),
    };
  } catch { return null; }
}
