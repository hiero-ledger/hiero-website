import { getAllPosts } from "@/lib/posts";

const SITE_URL = "https://hiero.org";
const FEED_LIMIT = 20;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildRssXml(feedPath: string): string {
  const posts = getAllPosts().slice(0, FEED_LIMIT);
  const feedUrl = toAbsoluteUrl(feedPath);
  const pubDate =
    posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString();

  const items = posts
    .map(post => {
      const url = toAbsoluteUrl(`/blog/${post.slug}`);
      const description = post.abstract ?? "";
      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid isPermaLink="true">${escapeXml(url)}</guid>
  <pubDate>${escapeXml(new Date(post.date).toUTCString())}</pubDate>
  <description>${escapeXml(description)}</description>
</item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Hiero Blog</title>
  <link>${escapeXml(toAbsoluteUrl("/blog"))}</link>
  <description>Stay up to date with our latest news and announcements.</description>
  <language>en-us</language>
  <lastBuildDate>${escapeXml(pubDate)}</lastBuildDate>
  <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />
${items}
</channel>
</rss>`;
}
