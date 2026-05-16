import { buildRssXml } from "@/lib/rss";

export function GET(): Response {
  // Keep this section-specific path in addition to /index.xml for clients that
  // discover feeds from either posts- or root-based conventions.
  return new Response(buildRssXml("/posts/index.xml"), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
